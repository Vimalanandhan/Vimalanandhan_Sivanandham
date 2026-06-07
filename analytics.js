(function(){
  window.va=window.va||function(){
    (window.vaq=window.vaq||[]).push(arguments);
  };

  function clean(value){
    return String(value||'').replace(/\s+/g,' ').trim().slice(0,120);
  }

  function event(name,data){
    var payload={};
    Object.keys(data||{}).forEach(function(key){
      var value=data[key];
      if(value!==undefined&&value!==null&&value!=='')payload[key]=clean(value);
    });
    window.va('event',{name:name,data:payload});
  }

  window.trackPortfolioEvent=event;

  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click',function(){
        event('navigation_click',{
          section:link.getAttribute('href').replace('#',''),
          label:link.textContent
        });
      });
    });

    document.querySelectorAll('a[href^="http"],a[href^="mailto:"]').forEach(function(link){
      link.addEventListener('click',function(){
        var href=link.getAttribute('href')||'';
        var section=link.closest('section');
        var type='outbound_click';
        if(href.indexOf('linkedin.com')>-1)type='linkedin_click';
        if(href.indexOf('github.com')>-1)type='github_click';
        if(href.indexOf('mailto:')===0)type='email_click';
        if(href.indexOf('pypi.org')>-1)type='pypi_click';
        if(href.indexOf('tableau.com')>-1)type='tableau_click';
        if(link.classList.contains('project-link'))type='project_click';
        if(link.classList.contains('btn'))type='cta_click';

        event(type,{
          label:link.textContent,
          section:section?section.id:'hero',
          destination:href.replace(/^mailto:/,'email:')
        });
      });
    });

    var form=document.getElementById('contactForm');
    if(form){
      form.addEventListener('submit',function(){
        event('contact_form_submit',{
          section:'contact'
        });
      },true);
    }

    var seen={};
    var sectionObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting&&entry.intersectionRatio>=0.55){
          var id=entry.target.id;
          if(id&&!seen[id]){
            seen[id]=true;
            event('section_view',{section:id});
          }
        }
      });
    },{threshold:[0.55]});

    document.querySelectorAll('section[id]').forEach(function(section){
      sectionObserver.observe(section);
    });
  });
})();
