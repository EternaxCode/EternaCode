import * as THREE from 'three';
import { C } from './constants';

export const TAIL_LEN = C.TAIL.len;

interface Pulse {
  from:  THREE.Vector3;
  to:    THREE.Vector3;
  color: THREE.Color;
  t : number;
  dt: number;
  trail: THREE.Vector3[];
}

export interface PulseState { pulses: Pulse[] }
export const createPulseState = (): PulseState => ({ pulses: [] });

function spawnSingle(from:THREE.Vector3,to:THREE.Vector3,color:THREE.Color,s:PulseState){
  if (s.pulses.length >= C.PULSE.maxCount) return;
  const speed = C.PULSE.baseSpeed + (Math.random()-0.5)*C.PULSE.speedVariance;
  s.pulses.push({
    from,to,color,
    t:0, dt:speed*0.001,
    trail: TAIL_LEN ? Array(TAIL_LEN).fill(from.clone()) : [],
  });
}

export function spawnPulseBurst(from:THREE.Vector3,to:THREE.Vector3,color:THREE.Color,
                                count:number,s:PulseState){
  for(let i=0;i<count;i++){
    spawnSingle(from,to,color,s);
    s.pulses[s.pulses.length-1].t = i/count;
  }
}

export function updatePulses(dt:number,s:PulseState){
  const done:{pos:THREE.Vector3;color:THREE.Color}[]=[];
  s.pulses = s.pulses.filter(p=>{
    p.t+=p.dt*dt;
    if(p.t>=1){ done.push({pos:p.to.clone(),color:p.color}); return false; }
    if(TAIL_LEN){
      const now=new THREE.Vector3().lerpVectors(p.from,p.to,p.t);
      p.trail.unshift(now); p.trail.length=TAIL_LEN;
    }
    return true;
  });
  return done;
}

export function writePulseBuffers(s:PulseState,pos:Float32Array,col:Float32Array){
  s.pulses.forEach((p,i)=>{
    const now=new THREE.Vector3().lerpVectors(p.from,p.to,p.t);
    pos.set(now.toArray(),i*3);
    col.set(p.color.toArray(),i*3);
  });
}
