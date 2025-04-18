/*** 
 * This script creates the "RT" logo
 * Mathematically, it is equivalent to an epicycle drawing
 * The circles' radii and phases are decided using the discrete Fourier transform
***/


/* =====================================================
   0. tiny vec2 helper
   ===================================================== */
   class Vec2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    add(v)            { this.x += v.x; this.y += v.y; return this; }
    clone()           { return new Vec2(this.x, this.y); }
    mag()             { return Math.hypot(this.x, this.y); }
    static zero()     { return new Vec2(0, 0); }
  }
  
  /* =====================================================
     1. Times‑style outlines for “R” & “T”
        (exported from Times New Roman, simplified)
     ===================================================== */
//   const svgPath_R = `
//   M83.6 0 L0 0 L0 1000 L230 1000
//   C438 1000 582 873 582 684
//   C582 537 497 433 354 388
//   L640 0 L518 0 L291 355 L133 355 L133 0 Z
//   `;
const svgPath_R_outer = `
M628.6021,647.4592c-5.8275-.3324-9.2963,4.1747-10.9999,8.4689-6.5238,26.3537-18.98,54.9285-36.5011,71.8274-15.3427,15.813-31.8427,23.7037-49.499,23.7037-22.3815-.2316-35.5639-8.6316-41.5-30.9999-16.0218-60.6005,1.7215-151.4396-9.5778-212.6249-10.4082-43.8918-48.065-80.6774-95.735-96.1873,90.9873-20.4855,201.6602-83.949,201.3139-183.2039-2.8736-109.3947-125.0356-161.4113-232.6236-159.9841-.0026-.0004-310.8463-.0004-310.8463-.0004l-4.875,31h21c39.1935,1.4419,75.8546-2.6313,76.1721,27.9053-.0002.0009-3.9846,24.079-3.9846,24.079L44.0083,676.256c-2.6094,18.1406-8.5469,30.0469-17.8281,35.7031-9.2812,5.6719-32.6245,8.5-70.062,8.5h-21.9688l-4.8906,31c35.4103-3.8905,257.0012-3.9456,292.4369.0005.0001-.0005,4.8751-31.0005,4.8751-31.0005-25.1382.403-73.8285-.4796-82.5308-5.5795-9.7817-3.7174-14.6567-11.233-14.6567-22.5455,0-.6406.6562-6.2969,1.9688-16.9688l42.6875-254.9067h112.7188c33.0201-.5511,67.6122,10.9277,86.7034,32.4686,6.8434,8.3131,12.3278,18.1569,16.4684,29.5475,6.9802,18.8437,7.1277,23.8198,7.1716,39.0469,1.4203,4.179-16.2266,123.783-14.9993,133.7804-1.8093,83.4617,72.4739,117.7653,146.8121,118.1572,20.1561-.0001,38.0468-5.0939,53.6561-15.2657,27.7434-16.1472,43.5344-49.7921,52.9216-75.5942,5.23-16.2577,12.1464-34.4403-6.8904-35.1401Z
`;

const svgPath_R_inner = `
M481.2646,157.6519c-18.4568-31.4836-35.4578-41.9899-72.4842-49.3439-40.8279-7.5431-51.7456-7.0056-93.6876-7.3281-41.1356,1.0534-61.814-2.4824-74.8908,8.8429-3.3748,3.2823-5.3904,6.4698-6.031,9.5791s-1.9219,9.25-3.8438,18.4062c0,0-43.9219,262.1719-43.9219,262.1719,82.455-.6271,195.8472,10.7881,254.5458-45.9249,35.2198-30.6064,52.8448-77.997,52.8448-142.1689,0-21.5-4.1875-39.5781-12.5312-54.2344Z
`;
  
const svgPath_T = `
M35.3994,84.2065l-57.25,225s25,0,25,0c5.7188-20.3438,9.7812-34.7344,12.1562-43.1719,3.2975-12.584,17.352-56.227,22.6246-67.3439,4.3844-8.9649,18.8598-40.0233,28.1097-45.4061,4.7188-3.25,10.922-7.875,18.5782-13.9063,7.6562-6.0156,15.4688-9.9219,23.4531-11.7188,7.9844-1.7812,17.5156-3.9844,28.6094-6.5938,26.3522-5.9858,50.1064-5.5764,79.6875-5.8595,34.7721.5375,48.8865-1.2218,65.0158,6.3586,8.0259,7.1863,4.1401,18.172,1.9532,39.5789-.0003.0001-88.0628,523.8903-88.0628,523.8903-1.9688,12.625-4.8125,21.4531-8.5625,26.4688-19.0207,17.8465-64.6039,18.0493-105.8433,18.7042-.0004-.0011-38.141-.0011-38.141-.0011,0,0-4.8906,31-4.8906,31,80.2081-3.7636,327.0949-3.9404,379.1405-.0005.0002.0005,5.3752-30.9995,5.3752-30.9995-33.5046.1775-106.6125.2612-120.1406-6.5644-13.0782-4.3731-19.6094-12.2481-19.6094-23.6231,0-3.2344.6406-8.5937,1.9531-16.0625,0,0,88.875-531.7339,88.875-531.7339,1.9688-9.4063,3.3594-15.5781,4.1719-18.5,9.4586-23.0954,36.2782-17.1562,76.4998-18.5165,60.9064.0009,101.7189,7.3447,122.4064,22.0009,39.3693,26.3327,32.3993,116.5448,25.6391,172.0002.0015-.0002,25.0015-.0002,25.0015-.0002,0,0,19.0469-225,19.0469-225,0,0-610.7969,0-610.7969,0Z
`;
  
  /* =====================================================
     2. helper → centred sampler for ANY svg path
     ===================================================== */
    function samplerFromPath(dString, scale = 1, flipY = true, dir = 1) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg   = document.createElementNS(svgNS, 'svg');
        svg.style.position = 'absolute';
        svg.style.left = '-9999px';
        document.body.appendChild(svg);
      
        // --- 1) split raw 'd' on subsequent Move commands (M or m) ---
        const subDs = dString
          .trim()
          .replace(/[\r\n]/g,' ')          // collapse newlines
          .match(/([Mm][^Mm]*)/g);         // ["M…Z", "M…Z", …]
      
        // --- 2) build <path> for each sub‑string, get lengths ---
        const loops = subDs.map(ds => {
          const p = document.createElementNS(svgNS, 'path');
          p.setAttribute('d', ds.trim());
          svg.appendChild(p);
          return { path: p, length: p.getTotalLength() };
        });
      
        // --- 3) greedy ordering: always start next loop nearest current end ---
        function dist(a,b){ const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy); }
        const ordered = [];
        let currentEnd = new DOMPoint(0,0);
        while (loops.length) {
          loops.sort((A,B)=>
            dist(A.path.getPointAtLength(0), currentEnd) -
            dist(B.path.getPointAtLength(0), currentEnd));
          const next = loops.shift();
          ordered.push(next);
          currentEnd = next.path.getPointAtLength(next.length);
        }
      
        // --- 4) overall metrics for centering & param mapping ---
        const totalLen = ordered.reduce((s,l)=>s+l.length,0);
        const temp     = document.createElementNS(svgNS, 'path');
        temp.setAttribute('d', dString.trim());
        svg.appendChild(temp);
        const bbox = temp.getBBox();
        const cx   = bbox.x + bbox.width/2;
        const cy   = bbox.y + bbox.height/2;
      
        // --- 5) sampler fn: t∈[0,1] → Vec2 on stitched loops ---
        return function(t){
          if (dir === -1) t = 1 - t;  
          let dist = t * totalLen;
          for (const {path,length} of ordered) {
            if (dist <= length){
              const pt = path.getPointAtLength(dist);
              const y  = flipY ? -(pt.y - cy) : (pt.y - cy);
              return new Vec2((pt.x - cx)*scale, y*scale);
            }
            dist -= length;
          }
          return Vec2.zero();   // fallback (shouldn’t hit)
        };
    }

  /* =====================================================
     3. Fourier helpers
     ===================================================== */
     const HARMONICS = 120;                // ±HARMONICS terms
     const SAMPLES   = 300;               // integration samples
     const TWO_PI    = 2 * Math.PI;
     
     function fourierCoeffs(pathFn) {
       const C = Array(2 * HARMONICS + 1).fill().map(() => new Vec2());
       for (let i = 0; i < SAMPLES; i++) {
         const p   = pathFn(i / SAMPLES);
         const phi = TWO_PI * i / SAMPLES;
         for (let n = -HARMONICS; n <= HARMONICS; n++) {
           const idx = n + HARMONICS;
           const c = Math.cos(n * phi), s = Math.sin(n * phi);
           C[idx].x +=  p.x * c + p.y * s;
           C[idx].y +=  p.y * c - p.x * s;
         }
       }
       for (let n = 0; n < C.length; n++) {
         C[n].x /= SAMPLES; C[n].y /= SAMPLES;
       }
       return C;
     }
     
     function radiiPhi(C) {
       const R = [], Phi = [];
       for (let n = -HARMONICS; n <= HARMONICS; n++) {
         const v   = C[n + HARMONICS];
         R  [n+HARMONICS] = v.mag();
         Phi[n+HARMONICS] = Math.atan2(v.y, v.x);
       }
       return {R, Phi};
     }   
  
  /* =====================================================
     4. build samplers & coeffs for R and T
     ===================================================== */
function samplerFixedCenter(dString, cx, cy, scale = 1, flipY = true, dir = 1){
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg   = document.createElementNS(svgNS,'svg');
    svg.style.position='absolute'; svg.style.left='-9999px';
    document.body.appendChild(svg);
    
    const path  = document.createElementNS(svgNS,'path');
    path.setAttribute('d', dString.trim());
    svg.appendChild(path);
    
    const len = path.getTotalLength();
    
    return t => {
        if (dir === -1) t = 1 - t;
        const p = path.getPointAtLength(t * len);
        const y = flipY ? -(p.y - cy) : (p.y - cy);
        return new Vec2((p.x - cx)*scale, y*scale);
    };
    }
    
    // 1) build outer sampler the normal way to capture its bbox centre
    const bboxOut  = (()=>{
    const tmp = document.createElementNS('http://www.w3.org/2000/svg','path');
    tmp.setAttribute('d', svgPath_R_outer.trim());
    document.body.appendChild(tmp);
    return tmp.getBBox();
})();

  const cx = bboxOut.x + bboxOut.width/2 + 600;
  const cy = bboxOut.y + bboxOut.height/2 + 425;
     
  const GLYPH_SCALE = 1;               // raw glyph size
  const pathR_outer = samplerFixedCenter(svgPath_R_outer, cx, cy, GLYPH_SCALE, false);
  const pathR_inner = samplerFixedCenter(svgPath_R_inner, cx, cy, GLYPH_SCALE, false, -1);
  const pathT = samplerFromPath(svgPath_T, GLYPH_SCALE, false);
  
  const {R : RRouter, Phi:PhiRouter} = radiiPhi(fourierCoeffs(pathR_outer));
  const {R : RRinner, Phi:PhiRinner} = radiiPhi(fourierCoeffs(pathR_inner));
  const {R : RT, Phi:PhiT} = radiiPhi(fourierCoeffs(pathT));
  
  /* =====================================================
     5. canvas setup
     ===================================================== */
  const canvas = document.getElementById('logoRT');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width,  H = canvas.height;
  
  /* letters will be drawn with their own local coord system,
     then translated:  R to the left, T to the right        */
  const LETTER_SPACING = 300;            // centre‑to‑centre distance
  const CANVAS_SCALE   = 0.35;           // overall shrink to fit nicely
  
  /* =====================================================
     6. per‑letter drawing
     ===================================================== */
  function drawLetter(R, Phi, xShift, t, trail, colorCircles) {
    const vecs = [];
    for (let n = -HARMONICS; n <= HARMONICS; n++) {
      const idx = n + HARMONICS;
      const arg = Phi[idx] + TWO_PI * n * t;
      vecs[idx] = new Vec2(R[idx] * Math.cos(arg),
                           R[idx] * Math.sin(arg));
    }
  
    ctx.save();
    ctx.translate(xShift, 0);
  
    /* draw circles & arms */
    ctx.lineWidth   = 2.5;
    ctx.strokeStyle = colorCircles;
    let base = Vec2.zero();
    for (let i = 0; i <= 2*HARMONICS; i++) {
      const n   = Math.pow(-1,i) * Math.floor((i+1)/2);
      const idx = n + HARMONICS;
      const v   = vecs[idx];
  
      ctx.beginPath();
      ctx.arc(base.x, base.y, R[idx], 0, TWO_PI);
      ctx.stroke(); 
  
      ctx.beginPath();
      ctx.moveTo(base.x, base.y);
      ctx.lineTo(base.x + v.x, base.y + v.y);
      ctx.stroke();
  
      base.add(v);
    }
    ctx.restore();
  
    /* store endpoint for trailing stroke */
    trail.push(base.add(new Vec2(xShift,0)));    // absolute coords
  }
  
  /* =====================================================
     7. main animation loop
     ===================================================== */
  const TRAIL_MAX = 2000;
  const trailsRouter = [], trailsRinner = [], trailsT = [];
  const duration = 5000;                      // ms per lap
  
  function frame(time) {
    /* clear full bitmap */
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,W,H);
  
    /* global transform: centre */
    ctx.setTransform(CANVAS_SCALE, 0,0, CANVAS_SCALE, W/2, H*0.55);
  
    const t = (time % duration) / duration;

    /* gray */
    const CIRCLE_COLOR = '#666'; 
  
    drawLetter(RRouter, PhiRouter, -LETTER_SPACING/2, t, trailsRouter, CIRCLE_COLOR);
    drawLetter(RRinner, PhiRinner, -LETTER_SPACING/2, t, trailsRinner, CIRCLE_COLOR);
    drawLetter(RT, PhiT,  LETTER_SPACING/2, t, trailsT, CIRCLE_COLOR);
  
    /* fade & draw trails */
    ctx.lineWidth = 6;
    for (const trail of [trailsRouter, trailsRinner, trailsT]) {
      for (let i = 1; i < trail.length; i++) {
        const alpha = i / trail.length;
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(trail[i-1].x, trail[i-1].y);
        ctx.lineTo(trail[i].x,   trail[i].y);
        ctx.stroke();
      }
      if (trail.length > TRAIL_MAX) trail.splice(0, trail.length - TRAIL_MAX);
    }
    requestAnimationFrame(frame);
  }
  
  requestAnimationFrame(frame);
  