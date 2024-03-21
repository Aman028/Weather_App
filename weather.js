const yourweather=document.querySelector("[yourweather]");
const searchweather=document.querySelector("[searchweather]");
const grantAccess=document.querySelector(".grant");
const grantbtn=document.querySelector("[grantt]");
const loader=document.querySelector(".loader");
const info=document.querySelector(".owndata");
const searchdiv=document.querySelector("[searchdiv]");
const searchinput=document.querySelector("[searchinput]");
const searchbtn=document.querySelector("[searchbtn]");
const searchform=document.querySelector('.searchform');

let currenttab=yourweather;
currenttab.classList.add("tabwas");
//yaha apna coordinate ka dikhana hoga
sessionstorageinfo();

yourweather.addEventListener('click',function(){
    switchtab(yourweather);
})
searchweather.addEventListener('click',function(){
    switchtab(searchweather);
})

function switchtab(tab){
    if(currenttab!=tab)
    {
        currenttab.classList.remove("tabwas");
        currenttab=tab;
        currenttab.classList.add("tabwas");

        if (!searchform.classList.contains("active")) {
            searchform.classList.add("active");
            info.classList.remove("active");
            grantAccess.classList.remove("active");
        }
        // Your Weather
        else {
            searchform.classList.remove("active");
            info.classList.remove("active");
            sessionstorageinfo();
        }
    }
}

function sessionstorageinfo(){
    const coordinates= sessionStorage.getItem("coordinatess");
    if(!coordinates)
    {
        grantAccess.classList.add("active");
    }
    else
    {
        const owncoordinates=JSON.parse(coordinates);
        getweatherinfo(owncoordinates);
    }
}

const APIKEY="168771779c71f3d64106d8a88376808a";
async function getweatherinfo(owncoordinates)
{
    const {lat,lon}=owncoordinates;
    grantAccess.classList.remove("active");
    loader.classList.add("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`);
        const data=await response.json();
        loader.classList.remove("active");
        info.classList.add("active");
        weatherinfoui(data);
    }
    catch(e)
    {
        loader.classList.remove("active");
        //or kuch bhi karennge
    }
}

function weatherinfoui(data)
{
    const name=document.querySelector("[cityname]");
    const flag=document.querySelector("[flag]");
    const env=document.querySelector("[env]");
    const imgenv=document.querySelector("[imgenv]");
    const temp=document.querySelector("[temp]");
    const windspeed=document.querySelector("[windspeed]");
    const humidity=document.querySelector("[humidity]");
    const clouds=document.querySelector("[clouds]");

    name.innerText=data?.name;
    flag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    env.innerText = data?.weather?.[0]?.description;
    imgenv.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${data?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${data?.clouds?.all.toFixed(2)} %`;
}

grantbtn.addEventListener('click',getlocation);

function getlocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else
    {
        grantbtn.style.display = 'none';
    }
}

function showposition(position)
{
    const coordinatess={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };
    sessionStorage.setItem("coordinatess", JSON.stringify(coordinatess));
    getweatherinfo(coordinatess);
}

searchform.addEventListener('submit',function(e){
    e.preventDefault();
    if(searchinput.value==="")
    {
        return;
    }
    weatherinfobycity(searchinput.value);
    searchinput.value="";
});
async function weatherinfobycity(city)
{
    loader.classList.add("active");
    //ignore karke dekho
    info.classList.remove("active");
    grantAccess.classList.remove("active");
    try
    {
        let promise2=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`);
        let data2=await promise2.json();

        loader.classList.remove("active");
        info.classList.add("active");
        weatherinfoui(data2);
    }
    catch(e)
    {
        loader.classList.remove("active");
        info.classList.remove("active");
    }
}
