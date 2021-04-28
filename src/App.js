import './App.css';
import {textDBNoFrontScreen, textDBHaveFrontScreen, videoUrls, typingSpeedArticle} from './text'
import React,{useState,useEffect} from 'react';
import ReactPlayer from "react-player";


const App = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [resultWord, setResultWord] = useState(0);
  const [editWord, setEditWord] = useState('');

  const [flag, setFlag] = useState(0);
  const [typingSpeedflag, setTypingSpeedFlag] = useState(false);
  const [oldTimeStamp, setOldTimeStamp] = useState(0);//時間戳記
  const [wrong, setWrong] = useState(0);//錯誤數
  const [errorRate, setErrorRate] = useState(0);//錯誤率
  const [finalWord, setFinalWord] = useState(0);//最後結果輸入字數
  const [finalWrong, setFinalWrong] = useState(0);//最後結果錯誤數
  const [articleNum, setArticleNum] = useState(0);//文章編號

  const [time, setTime] = useState({ms:0, s:0, m:0});//碼表
  const [interv, setInterv] = useState();
  let updatedMs = time.ms
  let updatedS = time.s
  let updatedM = time.m


  //模式轉換******************
  const [mode, setMode] = useState({
    open:'none',
    modeFlag:1,
    modeArticle:textDBNoFrontScreen
  });


  //文章內容
  const [text, setText] = useState(mode.modeArticle[articleNum])//把文字資料放入text內
  const arrayText = Array.from(text);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyIn, false);
    setEditWord(text.charAt(currentWord));
    return () => {
      window.removeEventListener("keydown", handleKeyIn, false);
    };
  }, [currentWord,mode.modeArticle])


  let arrayTextMap = arrayText.map((value,current)=>{
        if(current < currentWord){
          return <div key={current} className="normal correct">{value}</div>
        }
        if(current === currentWord ){
          return <div key={current} className="normal current" >{value}</div>//目前要打的字
        }else{
          return <div key={current} className="normal" >{value}</div>
        }
  })
  
  const run = () => {
    if(updatedM === 6){
      updatedM = 0;
      clearInterval(interv)
      return alert('Stop')
    }
    if(updatedS === 60){
      updatedM++;
      updatedS = 0;
    }
    if(updatedMs === 99){
      updatedS++;
      updatedMs = 0;
    }

    updatedMs++;
    return setTime({ms:updatedMs, s:updatedS, m:updatedM});
  }
  /*輸入觸發*/
  const handleKeyIn = (e) => {
    let add = 0;
    let error = 0;
    let timestamp
    let arrayLength = 0
    let articleNumCount = 0
    console.log('handleKeyIn');

    //第一次輸入
    console.log('flag:',flag);
    if(flag === 0){
      timestamp = Math.floor(new Date() / 1000);
      setArticleNum((setArticleNum) => setArticleNum + 1);
      console.log('first time');
      //打字測驗時間
      // if(typingSpeedflag){setTimeout(()=>{alert(`STOP`)},360000)}
      // if(typingSpeedflag){
      //   // run();
      //   console.log('setInterval');
      //   setInterv(setInterval(run, 10));
      // }
    }


    //全部輸入完畢
    if(currentWord  === arrayText.length - 1 && text.charAt(currentWord)===e.key){
      arrayLength = arrayText.length;
      articleNumCount = 1
      setText(mode.modeArticle[articleNum]);
      setArticleNum((setArticleNum) => setArticleNum + 1);
    }

    //計算輸入正確與錯誤
    if(text.charAt(currentWord)===e.key){
      //打字速度碼表判斷
      if(flag === 0 && typingSpeedflag){
        setInterv(setInterval(run, 10));
      }
      add = 1;
    }else if('Shift' === e.key || 'CapsLock' === e.key){

    }
    else{
      add = 1;
      error = 1;
    }
  console.log('flag上');
    setFlag(flag === 0 ? 1 : 1) 
    console.log('flag下');
    setResultWord((resultWord)=> resultWord + add);//最終輸入的字數
    setCurrentWord((currentWord)=> currentWord + add - error - arrayLength);//目前輸入的字數與重置
    setWrong((wrong)=> wrong+error);//錯誤數+1
  }
  /*結果顯示*/
  const resultClick = () => {
    console.log('resultClick');
    setFinalWord(resultWord)
    setFinalWrong(wrong)
    setErrorRate(wrong / resultWord )
  }
  const haveFrontScreenModeClick = () => {
    setMode({open : "video",modeFlag : 0, modeArticle: textDBHaveFrontScreen});
    setText(textDBHaveFrontScreen[articleNum]);
  }
  const haveNoFrontScreenModeClick = () => {
    setMode({open : "video none",modeFlag : 1, modeArticle: textDBNoFrontScreen});
    setText(textDBNoFrontScreen[articleNum]);
  }
  const typingSpeedClick = () => {
    console.log('typing');
    setMode({open : 'video none',modeFlag : 1, modeArticle: typingSpeedArticle});
    setText(typingSpeedArticle[articleNum]);
    setTypingSpeedFlag(true)
  }


  /*影片轉換*/
  const videoClick = () => {
    let url
    if(videoUrl.props.url == videoNoFrontScreen.props.url){
      url = videoHaveFrontScreen
    }else{
      url = videoNoFrontScreen
    }
    setVideoUrl(url)
  }
  const videoHaveFrontScreen = (<ReactPlayer
            className=''
            url= {videoUrls.haveFrontScreen}
            width='100%'
            playing={flag}
            />)

  const videoNoFrontScreen = (<ReactPlayer
            className=''
            url= {videoUrls.noFrontScreen}
            width='100%'
            playing={flag}
            />)

  const [videoUrl, setVideoUrl] = useState(videoHaveFrontScreen)
  /*影片轉換*/

  return (
    <>
    <div className="container">
      <div className="main">
        <div className="article">{arrayTextMap}</div>
        <div className={mode.open}>
            {/* {videoUrl} */}
            <ReactPlayer
            className=''
            url= {videoUrls.haveFrontScreen}
            width='100%'
            playing={flag}
            />
        </div>
    </div>

    </div>
    <div className="footer">
      <div onClick={resultClick} className="result-button">結果</div>
      {/* <div onClick={modeCliclk} className="result-button">切換模式</div> */}
      <div onClick={haveNoFrontScreenModeClick} className="result-button">無車前模式</div>
      <div onClick={haveFrontScreenModeClick} className="result-button">有車前模式</div>
      <div onClick={typingSpeedClick} className="result-button">打字速度測試</div>
      <div  className="result">正確率：{1 - errorRate.toFixed(3)}</div>
      <div  className="result">_錯誤率：{errorRate.toFixed(3)}</div>
      <div  className="result">_輸入字數：{finalWord}</div>
      <div  className="result">_錯誤數：{finalWrong}</div>
      <div  className="result">_時間計時：{time.m}:{time.s}:{time.ms}</div>
    </div>
    </>
  );
}

export default App;
