// window.addEventListener('scroll', () => {
//     document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
//   }, false);



function checkScroll(){
  let compscroll = getComputedStyle(document.body).getPropertyValue('--colorturnpoint');
  let wholepage = document.getElementById('wholepage');
  let colorreg = getComputedStyle(document.body).getPropertyValue('--reg');
    if ((window.pageYOffset / (document.body.offsetHeight - window.innerHeight))>compscroll && colorreg=="black"){
      if (wholepage.classList.contains('wholepagelight')){
        wholepage.classList.remove('wholepagelight');
      }
      wholepage.classList.add('wholepagedark');
    }
    else{
      if ((window.pageYOffset / (document.body.offsetHeight - window.innerHeight))<compscroll && colorreg=="white"){
        if(wholepage.classList.contains('wholepagedark')){
          wholepage.classList.remove('wholepagedark');
        }
        wholepage.classList.add('wholepagelight');
      }
    }
  };

window.addEventListener('scroll', checkScroll);

