// window.addEventListener('scroll', () => {
//     document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
//    }, false);



function checkScroll(){
    let compscroll = getComputedStyle(document.body).getPropertyValue('--colorturnpointLG');
    let compscroll2 = getComputedStyle(document.body).getPropertyValue('--colorturnpointLG2');
    let wholepage = document.getElementById('wholepage');
    let colorreg = getComputedStyle(document.body).getPropertyValue('--reg');
    if ((window.pageYOffset / (document.body.offsetHeight - window.innerHeight))>compscroll && (window.pageYOffset / (document.body.offsetHeight - window.innerHeight))<compscroll2 && colorreg=="#141414"){
      if (wholepage.classList.contains('wholepagelight')){
        wholepage.classList.remove('wholepagelight');
      }
      wholepage.classList.add('wholepagedark');
    }
    else{
      if (((window.pageYOffset / (document.body.offsetHeight - window.innerHeight))<compscroll || (window.pageYOffset / (document.body.offsetHeight - window.innerHeight))>compscroll2) && colorreg=="white"){
        if(wholepage.classList.contains('wholepagedark')){
          wholepage.classList.remove('wholepagedark');
        }
        wholepage.classList.add('wholepagelight');
      }
    }
  };

window.addEventListener('scroll', checkScroll);