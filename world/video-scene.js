// Remove only edge-connected black video backdrop; preserve the black vinyl and shoes.
const source=document.querySelector('#recordVideo'),canvas=document.createElement('canvas');
canvas.width=960;canvas.height=540;canvas.className='record-art record-canvas';canvas.setAttribute('aria-label','NONO与DU DU的动态唱片机');canvas.setAttribute('role','img');source.after(canvas);
const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
function paint(){if(source.readyState>=2&&!source.paused){ctx.drawImage(source,0,0,w,h);const frame=ctx.getImageData(0,0,w,h),d=frame.data;seen.fill(0);let head=0,tail=0;
 const visit=p=>{if(p<0||p>=seen.length||seen[p])return;seen[p]=1;const k=p*4;if(Math.max(d[k],d[k+1],d[k+2])<42){queue[tail++]=p;d[k+3]=0;}};
 for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x)}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1)}
 while(head<tail){const p=queue[head++];if(p%w)visit(p-1);if(p%w<w-1)visit(p+1);visit(p-w);visit(p+w)}ctx.putImageData(frame,0,0);canvas.style.visibility='visible';source.style.opacity='0';}
 if(source.requestVideoFrameCallback)source.requestVideoFrameCallback(paint);else setTimeout(paint,66);
}paint();
