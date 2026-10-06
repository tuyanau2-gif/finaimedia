(function(){
  const form=document.getElementById('money-test');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const data=new FormData(form);
    const score=[...data.values()].reduce((sum,value)=>sum+Number(value),0);
    const result=document.getElementById('money-test-result');
    const title=result.querySelector('h3');
    const copy=result.querySelector('p');
    if(score<=2){title.textContent='Устойчивая база';copy.textContent='У вас уже есть рабочая система. Следующий шаг — связать накопления с конкретными целями и регулярно проверять прогресс.'}
    else if(score<=4){title.textContent='Нужна настройка системы';copy.textContent='Деньги контролируются частично, но отдельные привычки мешают накоплениям. Начните с бюджета и автоматического перевода на цель сразу после дохода.'}
    else{title.textContent='Финансы требуют перезагрузки';copy.textContent='Сейчас семье сложно копить не из-за одной ошибки, а из-за отсутствия общей системы. Сначала определите обязательные расходы, долговую нагрузку и минимальный резерв.'}
    result.hidden=false;
    result.focus();
  });
  const recommendation=document.getElementById('recommendation-form');
  if(recommendation){recommendation.addEventListener('submit',function(){setTimeout(function(){const link=document.getElementById('result-link');if(link&&/^(balance|invest|mentor|business|junior)\.html$/.test(link.getAttribute('href')))link.setAttribute('href','glass/'+link.getAttribute('href'))},0)})}
})();
