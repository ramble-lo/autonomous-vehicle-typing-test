import './App.css';
import {textDBNoFrontScreen, textDBHaveFrontScreen, videoUrls} from './text'
import React,{useState,useEffect} from 'react';
import ReactPlayer from "react-player";


const App = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [resultWord, setResultWord] = useState(0);
  const [editWord, setEditWord] = useState('');

  const [flag, setFlag] = useState(0);
  const [oldTimeStamp, setOldTimeStamp] = useState(0);//時間戳記
  const [wrong, setWrong] = useState(0);//錯誤數
  const [errorRate, setErrorRate] = useState(0);//錯誤率
  const [finalWord, setFinalWord] = useState(0);//最後結果輸入字數
  const [finalWrong, setFinalWrong] = useState(0);//最後結果錯誤數
  const [articleNum, setArticleNum] = useState(0);//文章編號


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
  
  /*輸入觸發*/
  const handleKeyIn = (e) => {
    let add = 0;
    let error = 0;
    let timestamp
    let arrayLength = 0
    let articleNumCount = 0

    //第一次輸入
    if(flag === 0){
      timestamp = Math.floor(new Date() / 1000);
      setArticleNum((setArticleNum) => setArticleNum + 1);
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
      add = 1;
    }else if('Shift' === e.key || 'CapsLock' === e.key){

    }
    else{
      add = 1;
      error = 1;

    }

    setFlag(flag === 0 ? 1 : 1) 
    setResultWord((resultWord)=> resultWord + add);//最終輸入的字數
    setCurrentWord((currentWord)=> currentWord + add - error - arrayLength);//目前輸入的字數與重置
    setWrong((wrong)=> wrong+error);//錯誤數+1
  }

  /*結果顯示*/
  const resultClick = () => {
    setFinalWord(resultWord)
    setFinalWrong(wrong)
    setErrorRate(wrong / resultWord )
  }

  /*模式轉換*/
  const modeCliclk = () => {
    let v,f,t
     if(mode.modeFlag === 1){
       v = "video";
       f = 0;
       t =  textDBHaveFrontScreen;
     }else{
       v = "video none";
       f = 1 ;
       t = textDBNoFrontScreen;
     }
    setMode({open : v,modeFlag : f, modeArticle: t});
    setText(t[articleNum]);
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
      <div onClick={modeCliclk} className="result-button">切換模式</div>
      <div onClick={videoClick} className="result-button">切換影片</div>
      <div  className="result">正確率：{1 - errorRate.toFixed(3)}_</div>
      <div  className="result">錯誤率：{errorRate.toFixed(3)}_</div>
      <div  className="result">輸入字數：{finalWord}_</div>
      <div  className="result">錯誤數：{finalWrong}</div>
    </div>
    </>
  );
}

export default App;
