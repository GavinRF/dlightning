class s{constructor(){this.enabled=!0,this.visible=!1,this.frames=0,this.prevTime=performance.now(),this.fps=60,this.frameTimes=[],this.avgFrameTime=16.67,this.memory=null,this.container=null,this.fpsElement=null,this.msElement=null,this.memoryElement=null,this.createDOM(),this.keyHandler=null}createDOM(){this.container=document.createElement("div"),this.container.style.cssText=`
      position: fixed;
      top: 65px;
      left: 10px;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.7);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      border-radius: 4px;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      user-select: none;
    `,this.fpsElement=document.createElement("div"),this.fpsElement.textContent="FPS: --",this.container.appendChild(this.fpsElement),this.msElement=document.createElement("div"),this.msElement.textContent="Frame: --ms",this.container.appendChild(this.msElement),this.memoryElement=document.createElement("div"),this.memoryElement.style.cssText="margin-top: 4px; color: #00ccff;",this.memoryElement.textContent="Mem: --MB",this.memoryElement.style.display="none",this.container.appendChild(this.memoryElement),document.body.appendChild(this.container)}toggle(){this.visible=!this.visible,this.container.style.opacity=this.visible?"1":"0"}show(){this.visible=!0,this.container.style.opacity="1"}hide(){this.visible=!1,this.container.style.opacity="0"}begin(){this.startTime=performance.now()}end(){const e=performance.now();this.frames++,e>=this.prevTime+1e3&&(this.fps=Math.round(this.frames*1e3/(e-this.prevTime)),this.fpsElement.textContent=`FPS: ${this.fps}`,this.fpsElement.style.color=this.fps>=55?"#00ff00":this.fps>=30?"#ffff00":"#ff0000",this.frames=0,this.prevTime=e,this.updateMemory());const t=e-this.startTime;this.avgFrameTime=this.avgFrameTime*.9+t*.1,this.msElement.textContent=`Frame: ${t.toFixed(1)}ms`,this.msElement.style.color=t<16?"#00ff00":t<33?"#ffff00":"#ff0000"}updateMemory(){if(performance.memory){const e=performance.memory.usedJSHeapSize,t=Math.round(e/(1024*1024));this.memoryElement.textContent=`Mem: ${t}MB`,this.memoryElement.style.display="block"}else this.memoryElement.style.display="none"}getFPS(){return this.fps}getFrameTime(){return this.avgFrameTime}isPerformanceGood(){return this.fps>=55}dispose(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container)}}export{s as Stats};
