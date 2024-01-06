const char      = document.querySelectorAll('.char'     )
const col       = document.querySelector('.col'         )
const col_show  = document.querySelector('.col-show'    )
const buntton   = document.querySelector('.btn-return'  )
const timer     = document.querySelector('.timer'       )
const level     = document.querySelector('.select-level')
const score     = document.querySelector('.score'       )
const user_name = document.querySelector('.user-name'   )
const inputname = document.querySelector('.name'        )

// Foucs First Place When Windows Loade
char[0].focus()

//Set The Bes Score Value If It Exists in local Storage
localStorage.getItem('score') ?score.innerText = localStorage.getItem('score')+'%' :score.innerText = 0+'%'

//Define 'K' Variable To Use It When Index Of Places is Changed
let k ={
    i:5,
    i_1:11,
    i_2:17,
    i_3:23,
    i_4:29
}
let name = localStorage.getItem('name') || '';
let message = `🥳🥳Congratulations  ${name} Greate Job 🥳🥳`
let message_fail = `Sorry ${name} You Faild !! Game Over 😞😞`

//Change User Name After Input His Name
inputname.onchange=(e)=>{
    const  name = (e.target.value)[0].toUpperCase()+((e.target.value).split('').splice(1)).join('');
    user_name.innerText += name
    localStorage.setItem('name', name)
    message = `🥳🥳Congratulations  ${name} Greate Job 🥳🥳`
    message_fail = `Sorry ${name} You Faild !! Game Over 😞😞`
}

let word=''
//Get The Words From Json Object 
let words = fetch('./database.json').then(res=>res.json())
.then(res=>
    word =res.data[Math.floor(Math.random() * res.data.length)].toLowerCase()
    );

//Define Variables
let count = 0
let time =level.value !== 'Select Level'? level.value:'Time'
let element = 0
timer.innerHTML = +time



setInterval(() => {
    level.value !== 'Select Level' && time--
    if(time === -1){
        time = +level.value
    }
},1000)

//Main Function Changes Every One Second
const interval = setInterval(() => {
    timer.innerHTML = +time
  
    
//Change This Place To Next Place When Time Is Equal To Zero
    if(time == 0){
        
        char[element].setAttribute('readonly',true);
        char.forEach(e=>{
            e.classList.remove('active')
        })
        char[element+1].classList.add('active');
        char[element+1].focus()
        element++
        i=element

          //Show Message Of Failing If User Failde To Find The Word
        if(element >= char.length-1){
            Faild()
        }
    }

//Loop Of 'K' Class To Set Letter To Data-Word Of The Element
    for(let f in k) {
        if(k[f] === element ){
            for(let j=element; j <= element+6 ;j++){
                char[j].setAttribute('data-word',j-k[f]-1)
                char[j].classList.remove('disable')
                count = 0
            }
            for(let s=element; s >= element-5 ;s--){
                    
                    char[s].classList.add('disable')
                
            }
            char[element+1].focus();
            char.forEach(e=>{
                e.classList.remove('active')
                char[element+1].classList.add('active');
            })
        }
    }

char.forEach((e,i)=>{
//Set The Letter OF The First Try
    for(let s=0; s <=5 ;s++){
        char[s].setAttribute('data-word',s)
    }

//Event Change Character 
    e.oninput=()=>{
            const test = /^[a-zA-Z]/
            if (!e.value.match(test)){
                alert('Only English letters are allowed🙃')
                e.value=''
            return false
            }
        element = i
        time=level.value

        // Disable Change To The Place With Value
        if(e.value){
            e.setAttribute('readonly',true);
        }
        // If The Letter Is Correct Letter
        if((e.value).toLowerCase() === word[e.getAttribute('data-word')].toLowerCase()){
            count++;
            e.style.backgroundColor ='#ff9800';
            e.style.color = 'white';
            e.classList.add('yes-circle')
        //If The Word Contain The Letter Choases
        }else if (word.includes((e.value).toLowerCase())){
            e.style.backgroundColor ='#009688';
        //The Wrong Letter
        }else{
            e.style.backgroundColor ='#263238';
            e.style.color = 'red';
        }

        //Show Message Of Failing If User Failde To Find The Word
        if(i===char.length-1 && char[i].value !== ''){
            Faild()
        }

        //Show Message Of Success If User Successfully To Find Word 
        if(count === 6){
            clearInterval(interval)
            col.style.display = 'none';
            col_show.style.display = 'flex';
            col_show.setAttribute('data-message',message);
            col_show.setAttribute('data-right',`${105-i} %`);

            if(localStorage.getItem('score')){
        //Shange Best Score Value Into LocalStorge If This Score Greater Than It
                if(`${105-i}` > Number(localStorage.getItem('score'))){
                    
                    localStorage.setItem('score',`${105-i}`);
                }
            }else{
                
                localStorage.setItem('score',`${105-i}`);
            }
            col_show.setAttribute('data-word','Your Score = ');
            buntton.innerText = 'RePlay';
            buntton.style.display = 'block';
            inputname.style.display = 'none';

        }
        else{
        // // IF User Failed to Find Right Word Continue to The Next Try
        char.forEach(e=>{
            if(char[element+1]){
                char[element+1].classList.add('active');
                e.classList.remove('active')
                !(char[element+1].className.includes('disable')) && char[element+1].focus();
            }
        })
            
        }
        }
    })
    //Show Message Of Failing If User Failde To Find The Word
    if(element >= char.length){
        Faild()
    }
}, 1000);

    // Replay Button 
    buntton.addEventListener('click',()=>{
        level.style.visibility = 'visible';
        
            if(buntton.innerText === 'Try Again' || buntton.innerText === 'RePlay'){
                window.location.reload();
            }
            // Start Play Button When Choase Levels
            level.onchange = ()=>{
                    col.style.display = 'block';
                    col_show.style.display = 'none';
                    level.style.visibility = 'hidden';
                    time=level.value
                char[0].focus()
                char[0].classList.add('active');
            }
            if(level.value !== 'Select Level'){
                col.style.display = 'block';
                col_show.style.display = 'none';
                char[0].focus()
                char[0].classList.add('active');
                time = level.value
            }
        })
        //Function Of Failure
        function Faild(){
            col.style.display = 'none';
            col_show.style.display = 'flex';
            col_show.setAttribute('data-message',message_fail);
            col_show.setAttribute('data-right',word);
            col_show.setAttribute('data-word','Right Word = ');
            buntton.innerHTML = 'Try Again';
            buntton.style.display = 'block';
            inputname.style.display = 'none';
            clearInterval(interval)
        }


       