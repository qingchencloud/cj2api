import { DEFAULT_MODEL } from './utils';

export function renderDemoPage(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CJ2API</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%234a9eff'/%3E%3Cstop offset='100%25' stop-color='%234ade80'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='6' fill='%230a0a0a'/%3E%3Crect x='1.5' y='1.5' width='29' height='29' rx='5' fill='none' stroke='url(%23g)' stroke-width='1.5'/%3E%3Ctext x='16' y='21.5' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='700' font-size='14' fill='url(%23g)'%3ECJ%3C/text%3E%3C/svg%3E">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0a0a0a;color:#e0e0e0;min-height:100vh;display:flex;justify-content:center;padding:2rem 1rem}
    .container{max-width:760px;width:100%}
    h1{font-size:1.6rem;color:#fff;display:inline}
    .header{display:flex;align-items:center;gap:.75rem;margin-bottom:.25rem}
    .badge{font-size:.65rem;background:#1a3a1a;color:#4ade80;padding:.15rem .5rem;border-radius:99px;border:1px solid #2a4a2a}
    .subtitle{color:#666;font-size:.8rem;margin-bottom:1.5rem}
    .subtitle a{color:#4a9eff;text-decoration:none}
    .subtitle a:hover{text-decoration:underline}
    .hint{color:#555;font-size:.72rem;margin-bottom:1.5rem;padding:.4rem .7rem;background:#0f1115;border:1px solid #1e1e2a;border-radius:6px}
    .card{background:#141414;border:1px solid #252525;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
    .card-title{font-size:.85rem;color:#999;margin-bottom:.75rem;font-weight:500}
    label{display:block;font-size:.78rem;color:#888;margin-bottom:.3rem}
    input[type="text"],input[type="number"],textarea,select{width:100%;background:#0c0c0c;border:1px solid #2a2a2a;border-radius:6px;color:#e0e0e0;padding:.45rem .6rem;font-size:.82rem;font-family:inherit;outline:none;transition:border-color .2s}
    input:focus,textarea:focus,select:focus{border-color:#4a9eff}
    textarea{resize:vertical;min-height:70px}
    .row{display:flex;gap:.75rem;margin-bottom:.65rem}
    .row>div{flex:1}
    .check-row{display:flex;align-items:center;gap:.5rem;margin:.65rem 0}
    .check-row input[type="checkbox"]{accent-color:#4a9eff}
    .check-row label{margin:0}
    button{border:none;border-radius:6px;padding:.5rem 1.1rem;font-size:.82rem;cursor:pointer;transition:all .2s}
    .btn-primary{background:#4a9eff;color:#fff}
    .btn-primary:hover{background:#3a8eef}
    .btn-primary:disabled{opacity:.4;cursor:not-allowed}
    .btn-sm{background:#1a1a1a;color:#aaa;border:1px solid #333;padding:.3rem .7rem;font-size:.72rem}
    .btn-sm:hover{background:#252525;color:#fff}
    .endpoint{background:#111118;border:1px solid #1e1e30;border-radius:6px;padding:.45rem .7rem;font-family:"SF Mono",Monaco,Consolas,monospace;font-size:.78rem;color:#7aa2f7;margin-bottom:.4rem;display:flex;justify-content:space-between;align-items:center}
    .endpoint .method{color:#4ade80;margin-right:.5rem}
    #output{background:#0c0c0c;border:1px solid #252525;border-radius:8px;padding:1rem;min-height:50px;max-height:400px;overflow-y:auto;white-space:pre-wrap;word-break:break-word;font-size:.82rem;line-height:1.65;color:#ccc}
    .stats-bar{display:flex;gap:1rem;flex-wrap:wrap;padding:.6rem .8rem;background:#0c0c0c;border:1px solid #252525;border-top:none;border-radius:0 0 8px 8px;font-size:.72rem;color:#666}
    .stats-bar .stat{display:flex;align-items:center;gap:.3rem}
    .stats-bar .val{color:#4ade80;font-family:monospace}
    .stats-bar .val.err{color:#f87171}
    .code-block{position:relative;background:#0c0c0c;border:1px solid #252525;border-radius:6px;padding:.7rem .8rem;font-family:"SF Mono",Monaco,Consolas,monospace;font-size:.72rem;line-height:1.6;color:#a0a0a0;overflow-x:auto;margin-bottom:.6rem;white-space:pre}
    .code-block .copy-btn{position:absolute;top:.4rem;right:.4rem;background:#1a1a1a;color:#888;border:1px solid #333;border-radius:4px;padding:.15rem .4rem;font-size:.65rem;cursor:pointer}
    .code-block .copy-btn:hover{color:#fff;background:#333}
    .tab-bar{display:flex;gap:0;margin-bottom:.75rem;border-bottom:1px solid #252525}
    .tab{padding:.4rem .9rem;font-size:.78rem;color:#666;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s}
    .tab:hover{color:#aaa}
    .tab.active{color:#4a9eff;border-bottom-color:#4a9eff}
    .tab-content{display:none}
    .tab-content.active{display:block}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CJ2API</h1>
      <span class="badge">v1.0</span>
    </div>
    <p class="subtitle">OpenAI 兼容 API · 基于 <a href="https://chatjimmy.ai" target="_blank">ChatJimmy</a></p>
    <p class="hint">无需 API Key — 如客户端要求填写密钥，随意输入任意字符串即可</p>

    <div class="card">
      <div class="card-title">接口端点</div>
      <div class="endpoint"><span><span class="method">POST</span>/v1/chat/completions</span></div>
      <div class="endpoint"><span><span class="method">GET</span>/v1/models</span></div>
    </div>

    <div class="card">
      <div class="tab-bar">
        <div class="tab active" onclick="switchTab('test')">测试</div>
        <div class="tab" onclick="switchTab('curl')">cURL</div>
        <div class="tab" onclick="switchTab('python')">Python</div>
        <div class="tab" onclick="switchTab('node')">Node.js</div>
      </div>

      <div id="tab-test" class="tab-content active">
        <div class="row">
          <div><label>模型</label><input type="text" id="model" value="${DEFAULT_MODEL}" placeholder="模型名称"></div>
          <div><label>Top K</label><input type="number" id="topk" value="8" min="1" max="50"></div>
        </div>
        <div style="margin-bottom:.65rem"><label>系统提示词</label><textarea id="system" rows="2" placeholder="可选"></textarea></div>
        <div style="margin-bottom:.65rem"><label>消息内容</label><textarea id="msg" rows="3" placeholder="输入消息...">你好</textarea></div>
        <div class="check-row"><input type="checkbox" id="stream" checked><label for="stream">流式输出</label></div>
        <button class="btn-primary" id="sendBtn" onclick="send()">发送请求</button>
      </div>

      <div id="tab-curl" class="tab-content">
        <div class="code-block"><button class="copy-btn" onclick="copyCode(this)">复制</button>curl -X POST https://your-domain/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
  "model": "${DEFAULT_MODEL}",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": false
}'</div>
      </div>

      <div id="tab-python" class="tab-content">
        <div class="code-block"><button class="copy-btn" onclick="copyCode(this)">复制</button>import requests

resp = requests.post(
    "https://your-domain/v1/chat/completions",
    json={
        "model": "${DEFAULT_MODEL}",
        "messages": [{"role": "user", "content": "你好"}],
        "stream": False
    }
)
print(resp.json()["choices"][0]["message"]["content"])</div>
      </div>

      <div id="tab-node" class="tab-content">
        <div class="code-block"><button class="copy-btn" onclick="copyCode(this)">复制</button>const resp = await fetch("https://your-domain/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "${DEFAULT_MODEL}",
    messages: [{ role: "user", content: "你好" }],
    stream: false
  })
});
const data = await resp.json();
console.log(data.choices[0].message.content);</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">响应结果</div>
      <div id="output">点击「发送请求」查看结果</div>
      <div class="stats-bar" id="stats" style="display:none">
        <div class="stat">耗时 <span class="val" id="s-time">-</span></div>
        <div class="stat">Prompt <span class="val" id="s-prompt">-</span></div>
        <div class="stat">Completion <span class="val" id="s-comp">-</span></div>
        <div class="stat">Total <span class="val" id="s-total">-</span></div>
        <div class="stat">速度 <span class="val" id="s-speed">-</span></div>
      </div>
    </div>
  </div>

  <script>
    function switchTab(name){
      document.querySelectorAll('.tab-content').forEach(function(e){e.classList.remove('active')});
      document.querySelectorAll('.tab').forEach(function(e){e.classList.remove('active')});
      document.getElementById('tab-'+name).classList.add('active');
      var map={test:'测试',curl:'cURL',python:'Python',node:'Node.js'};
      document.querySelectorAll('.tab').forEach(function(e){if(e.textContent===map[name])e.classList.add('active')});
    }
    function copyCode(btn){
      var block=btn.parentElement;
      var text=block.textContent.replace('复制','').trim();
      navigator.clipboard.writeText(text);
      btn.textContent='已复制';
      setTimeout(function(){btn.textContent='复制'},1500);
    }
    function showStats(time,prompt,comp,total,speed,isErr){
      var s=document.getElementById('stats');
      s.style.display='flex';
      var cls=isErr?'val err':'val';
      ['s-time','s-prompt','s-comp','s-total','s-speed'].forEach(function(id){
        document.getElementById(id).className=cls;
      });
      document.getElementById('s-time').textContent=time;
      document.getElementById('s-prompt').textContent=prompt;
      document.getElementById('s-comp').textContent=comp;
      document.getElementById('s-total').textContent=total;
      document.getElementById('s-speed').textContent=speed;
    }
    async function send(){
      var btn=document.getElementById('sendBtn');
      var out=document.getElementById('output');
      var statsEl=document.getElementById('stats');
      btn.disabled=true;
      out.textContent='请求中...';
      statsEl.style.display='none';
      var model=document.getElementById('model').value;
      var topK=parseInt(document.getElementById('topk').value)||8;
      var sys=document.getElementById('system').value;
      var msg=document.getElementById('msg').value;
      var isStream=document.getElementById('stream').checked;
      var messages=[];
      if(sys)messages.push({role:'system',content:sys});
      messages.push({role:'user',content:msg});
      var body={model:model,messages:messages,stream:isStream,top_k:topK};
      var t0=performance.now();
      try{
        var resp=await fetch('/v1/chat/completions',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(body)
        });
        if(!isStream){
          var data=await resp.json();
          var ms=((performance.now()-t0)/1000).toFixed(2);
          if(data.error){
            out.textContent='Error: '+data.error.message;
            showStats(ms+'s','-','-','-','-',true);
          }else{
            out.textContent=data.choices[0].message.content;
            var u=data.usage||{};
            var comp=u.completion_tokens||0;
            var spd=comp>0?(comp/parseFloat(ms)).toFixed(1)+' tok/s':'-';
            showStats(ms+'s',u.prompt_tokens||'-',comp||'-',u.total_tokens||'-',spd,false);
          }
        }else{
          out.textContent='';
          var reader=resp.body.getReader();
          var decoder=new TextDecoder();
          var buf='';
          var content='';
          var usage=null;
          while(true){
            var r=await reader.read();
            if(r.done)break;
            buf+=decoder.decode(r.value,{stream:true});
            var lines=buf.split('\\n');
            buf=lines.pop();
            for(var i=0;i<lines.length;i++){
              var line=lines[i].trim();
              if(!line.startsWith('data: '))continue;
              var d=line.substring(6);
              if(d==='[DONE]')continue;
              try{
                var chunk=JSON.parse(d);
                if(chunk.choices&&chunk.choices.length>0&&chunk.choices[0].delta&&chunk.choices[0].delta.content){
                  content+=chunk.choices[0].delta.content;
                  out.textContent=content;
                }
                if(chunk.usage)usage=chunk.usage;
              }catch(e){}
            }
          }
          var ms=((performance.now()-t0)/1000).toFixed(2);
          if(!content){
            out.textContent='(空响应)';
            showStats(ms+'s','-','-','-','-',true);
          }else{
            var comp=usage?(usage.completion_tokens||0):0;
            var spd=comp>0?(comp/parseFloat(ms)).toFixed(1)+' tok/s':'-';
            showStats(ms+'s',usage?(usage.prompt_tokens||'-'):'-',comp||'-',usage?(usage.total_tokens||'-'):'-',spd,false);
          }
        }
      }catch(e){
        out.textContent='请求失败: '+e.message;
        var ms=((performance.now()-t0)/1000).toFixed(2);
        showStats(ms+'s','-','-','-','-',true);
      }
      btn.disabled=false;
    }
    (function(){
      var origin=window.location.origin;
      document.querySelectorAll('.code-block').forEach(function(el){
        el.innerHTML=el.innerHTML.replace(/https:\/\/your-domain/g,origin);
      });
    })();
  </script>
</body>
</html>`;
}