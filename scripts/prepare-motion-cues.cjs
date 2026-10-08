const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,file);
require.extensions['.css']=()=>{};
const {fullScenes}=require('../src/demo/KoraxNewComplete.tsx');
const cues=[];
const duration={'whoosh-soft':.42,'whoosh-swipe':.52,'pop-soft':.17,'click-soft':.072,'accent-soft':.30,'confirm-soft':.34};
const levels={'whoosh-soft':.115,'whoosh-swipe':.105,'pop-soft':.095,'click-soft':.075,'accent-soft':.11,'confirm-soft':.085};
const add=(time,sound,reason,scale=1)=>cues.push({time:Math.max(0,Math.round(time*30)/30),sound,volume:+(levels[sound]*scale).toFixed(4),duration:duration[sound],reason});
const pop=(time,reason)=>add(time+.055,'pop-soft',reason);
// Same timestamps as the approved opening: text emphasis, cards and moving masks.
add(.08,'whoosh-soft','Opening title',.7);add(1.95,'accent-soft','WhatsApp emphasis');
for(const at of [2.92,3.78,4.62,6.2])pop(at,'Opening service chip');
add(6.95,'whoosh-swipe','Presenter moves into large portrait');
add(8.95,'whoosh-soft','Portrait becomes circle');pop(10.6,'More demand');pop(11,'WhatsApp hub');
for(const at of [13.22,14.42,15.52])pop(at,'Acquisition source card');
add(16.55,'whoosh-swipe','Three problems transition');add(16.9,'accent-soft','Number three',.8);
for(const at of [17.2,17.4,17.6])add(at+.05,'click-soft','Problem number card',.75);
add(18.95,'whoosh-soft','First problem transition');pop(21,'Illustrative chat card');add(23.27,'click-soft','Interest decline emphasis',.8);

fullScenes.forEach((s,index)=>{
    add(Math.max(26,s.start-.22),index%2?'whoosh-soft':'whoosh-swipe','Scene '+s.kind+' transition',s.end-s.start<3?.65:1);
    // No sound for each subtitle word; only meaningful graphic actions.
    if(['training','context','diagnosis','skills'].includes(s.kind)){
        const explicit=s.start===72.64?[72.64,75.22,76.14,77.64]:s.start===102.98?[106.46,108.56,109.68,111.28]:null;
        (s.rows??[]).forEach((_,i)=>pop(explicit?.[i]??s.start+.3+i*Math.min(1.7,(s.end-s.start-1.5)/s.rows.length),'Information card'));
    } else if(s.kind==='screen'){
        pop(s.start+.15,'Real product screen entry');
        add(s.start+1.5,'whoosh-soft','Product screen zoom',.55);
    } else if(['team','organized','setup'].includes(s.kind)){
        [0,.25,.5].forEach(i=>pop(s.start+.1+i,'Connected operation node'));
        add(s.start+1.27,'accent-soft','Korax hub',.75);
    } else if(s.kind==='journey'){
        if(s.rows){const times=s.start===181.06?[181.06,182.58,185.12,187.42]:[190.32,192.68,195.26];times.forEach(time=>pop(time,'Customer journey step'));}
        else pop(s.start+1.2,'Journey hub');
    } else if(s.kind==='scattered'){
        [0,1.4,2.8].forEach(i=>pop(s.start+.2+i,'Scattered attendant card'));
    } else if(s.kind==='forgotten')pop(s.start+.4,'Quotation bubble');
    else if(s.kind==='process')add(47.25,'accent-soft','Process emphasis');
    else if(s.kind==='brand')add(49.62,'accent-soft','Korax reveal');
    else if(s.kind==='entry'){pop(53.32,'WhatsApp card');add(57.26,'whoosh-soft','WhatsApp to operation connection',.7);pop(57.5,'Korax operation card');}
    else if(s.kind==='ai'){add(61.52,'accent-soft','Digital employee reveal',.8);add(64.82,'click-soft','Knowledge and action emphasis',.8);}
    else if(s.kind==='contrast'){pop(s.start+.2,'Generic response card');pop(s.start+.7,'Objective and context card');}
    else if(s.kind==='handoff'){pop(s.start+.3,'Digital employee');pop(s.start+1.2,'Human attendant');add(98.06,'whoosh-soft','Handoff connection',.7);add(100.35,'confirm-soft','Context reaches the team');}
    else if(s.kind==='follow'){pop(s.start+.3,'Quotation request');add(152.38,'click-soft','Follow-up emphasis',.8);}
    else if(s.kind==='schedule')[156.5,157.26,158.46].forEach(at=>add(at+.05,'click-soft','Return schedule card'));
    else if(s.kind==='auto'){pop(s.start+.2,'Automatic return flow');add(169.2,'click-soft','Illustrative return message');}
    else if(s.kind==='devices')[205.06,205.94,206.52].forEach(at=>pop(at,'Device entry'));
    else if(s.kind==='partner'){pop(s.start+.3,'Company and Korax team');add(s.start+1.55,'click-soft','Implementation stages',.8);}
    else if(s.kind==='enablement')[0,1.1,2.2].forEach(i=>pop(s.start+.3+i,'Team training card'));
    else if(s.kind==='closing')add(s.start+.36,'accent-soft','Closing emphasis',.65);
    else if(s.kind==='cta'){add(s.start+.25,'confirm-soft','Schedule a demonstration button');add(281.82,'click-soft','Contact instruction',.75);}
});
cues.sort((a,b)=>a.time-b.time);
// Avoid piling up a click and a pop at the same moment.
const clean=cues.filter((cue,index)=>!(cue.sound==='pop-soft'&&index>0&&cue.time-cues[index-1].time<.085&&cues[index-1].sound==='pop-soft'));
for(const cue of clean)if(cue.time+cue.duration>287.166667)throw Error('Cue out of bounds');
fs.writeFileSync(path.join(__dirname,'../src/demo/motionSoundCues.json'),JSON.stringify(clean,null,2)+'\n');
console.log('Prepared '+clean.length+' motion sound cues across the full video.');
