import MusicController from './MusicController.js';

export function initGame() {
    const gc = document.getElementById('game-canvas');
    if (!gc) return;
    const cx = gc.getContext('2d');
    const GW = 800, GH = 400;
    gc.width = GW; gc.height = GH;

    const GRAV = 0.55, JFORCE = -10.2, MSPD = 3.5, PW = 18, PH = 26;
    const gk = {};
    let gs = 'idle';
    // Initialize with safe defaults so gDrawIdle works before gInit
    let pl = { x: 80, y: 310, vx: 0, vy: 0, grounded: false, right: true };
    let cam = { x: 0 };
    let plats = [], colls = [], parts = [];
    let scr = { skills: 0, totalSkills: 0, esp: 0, totalEsp: 0, prt: 0, totalPrt: 0 };
    let t0 = Date.now(), espT = 0, wlk = 0, role = 'Student';
    let gVis = false;
    let shakeT = 0, confetti = [], bubble = null, wasGrounded = false, enemies = [], hitCooldown = 0;
    let zoneTransition = null, hasDoubleJump = false, djUsed = false, notify = null;
    // Boss interaction
    let boss = null, bullets = [];
    // Zone transition boundary (roughly where Munich zone starts)
    const ZONE_BORDER = 1500;

    const PLATS = [
        { x: 0, y: 350, w: 250, zone: 'rome' },
        { x: 300, y: 310, w: 140, label: "LUMSA '02", role: 'Student', zone: 'rome' },
        { x: 500, y: 270, w: 130, label: "Jr Dev '03", role: 'Junior Dev', zone: 'rome' },
        { x: 690, y: 305, w: 140, label: "LUMSA MA '05", zone: 'rome' },
        { x: 885, y: 265, w: 75, zone: 'rome' },
        { x: 1015, y: 225, w: 155, label: "EgoRego '07", role: 'Founder & CEO', zone: 'rome' },
        { x: 1225, y: 265, w: 75, zone: 'rome' },
        { x: 1355, y: 200, w: 165, label: "Teacher '09", role: 'Teacher', zone: 'rome' },
        { x: 1575, y: 260, w: 75, zone: 'munich' },
        { x: 1705, y: 300, w: 75, zone: 'munich' },
        { x: 1835, y: 260, w: 145, label: "Safelog '13", role: 'Software Dev', zone: 'munich' },
        { x: 2035, y: 220, w: 150, label: "WIGeoGIS '15", role: 'Full-Stack Dev', zone: 'munich' },
        { x: 2240, y: 265, w: 75, zone: 'munich', moving: true, mx0: 2240, mx1: 2310, mspd: 0.5 },
        { x: 2370, y: 205, w: 145, label: "xbAV '18", role: 'Sr Frontend Dev', zone: 'munich' },
        { x: 2570, y: 160, w: 165, label: "Accenture '20", role: 'Eng Manager', zone: 'munich' },
        { x: 2790, y: 210, w: 75, zone: 'munich', moving: true, mx0: 2780, mx1: 2850, mspd: 0.6 },
        { x: 2920, y: 125, w: 220, label: "Quantilope '23", role: 'Sr Eng Manager', zone: 'munich', final: true }
    ];

    const COLLS = [
        // Rome zone — tech skills on career platforms
        { x: 340, y: 280, label: 'HTML', color: '#e34c26', type: 'skill' },
        { x: 400, y: 280, label: 'CSS', color: '#1572b6', type: 'skill' },
        { x: 540, y: 240, label: 'JS', color: '#f7df1e', type: 'skill' },
        { x: 730, y: 275, label: 'PHP', color: '#777bb4', type: 'skill' },
        { x: 1060, y: 195, label: 'WP', color: '#21759b', type: 'skill' },
        { x: 1400, y: 170, label: 'EDU', color: '#ff6b6b', type: 'skill' },
        // Rome zone — espresso cups ON platforms (reachable by standing or small jump)
        { x: 100, y: 320, type: 'espresso' },   // on P0 ground (y:350)
        { x: 200, y: 318, type: 'espresso' },   // on P0 ground
        { x: 370, y: 278, type: 'espresso' },   // on P1 LUMSA (y:310)
        { x: 560, y: 240, type: 'espresso' },   // on P2 Jr Dev (y:270)
        { x: 760, y: 272, type: 'espresso' },   // on P3 LUMSA MA (y:305)
        { x: 920, y: 235, type: 'espresso' },   // on P4 step (y:265)
        { x: 1080, y: 195, type: 'espresso' },  // on P5 EgoRego (y:225)
        { x: 1140, y: 195, type: 'espresso' },  // on P5 EgoRego
        { x: 1420, y: 168, type: 'espresso' },  // on P7 Teacher (y:200)
        { x: 1490, y: 170, type: 'espresso' },  // on P7 Teacher
        // Munich zone — tech skills on career platforms
        { x: 1880, y: 230, label: 'C#', color: '#68217a', type: 'skill' },
        { x: 2080, y: 190, label: 'Ang', color: '#dd0031', type: 'skill' },
        { x: 2410, y: 175, label: 'Vue', color: '#42b883', type: 'skill' },
        { x: 2475, y: 175, label: 'React', color: '#61dafb', type: 'skill' },
        { x: 2615, y: 130, label: 'TS', color: '#3178c6', type: 'skill' },
        { x: 2680, y: 130, label: 'AWS', color: '#ff9900', type: 'skill' },
        { x: 2980, y: 95, label: 'AI', color: '#c084fc', type: 'skill' },
        { x: 3050, y: 95, label: 'LLM', color: '#34d399', type: 'skill' },
        // Munich zone — pretzels ON platforms (reachable by standing or small jump)
        { x: 1610, y: 228, type: 'pretzel' },   // on P8 step (y:260)
        { x: 1740, y: 268, type: 'pretzel' },   // on P9 step (y:300)
        { x: 1900, y: 228, type: 'pretzel' },   // on P10 Safelog (y:260)
        { x: 2100, y: 188, type: 'pretzel' },   // on P11 WIGeoGIS (y:220)
        { x: 2270, y: 233, type: 'pretzel' },   // on P12 step (y:265)
        { x: 2450, y: 172, type: 'pretzel' },   // on P13 xbAV (y:205)
        { x: 2640, y: 128, type: 'pretzel' },   // on P14 Accenture (y:160)
        { x: 2700, y: 130, type: 'pretzel' },   // on P14 Accenture
        { x: 2960, y: 93, type: 'pretzel' },    // on P16 Quantilope (y:125)
        { x: 3020, y: 95, type: 'pretzel' }     // on P16 Quantilope
    ];

    // Bavarian flag goal position (right side of final platform)
    const FLAG = { x: 3105, pY: 125 };

    // Enemies — three types of expat life obstacles
    const ENEMIES = [
        // Bureaucracy — angry paperwork
        { platIdx: 2, ox: 10, range: 80, spd: 0.8, type: 'bureaucracy', label: 'VISA', zone: 'rome' },
        { platIdx: 7, ox: 15, range: 110, spd: 0.7, type: 'bureaucracy', label: 'TAX', zone: 'rome' },
        { platIdx: 11, ox: 20, range: 95, spd: 0.85, type: 'bureaucracy', label: 'STEUER', zone: 'munich' },
        { platIdx: 14, ox: 25, range: 110, spd: 0.95, type: 'bureaucracy', label: 'ANTRAG', zone: 'munich' },
        // Homesick — sad little heart/suitcase
        { platIdx: 5, ox: 20, range: 100, spd: 0.6, type: 'homesick', label: 'MAMMA!', zone: 'rome' },
        { platIdx: 10, ox: 10, range: 90, spd: 0.55, type: 'homesick', label: 'PIZZA...', zone: 'munich' },
        // Bad weather — angry rain cloud
        { platIdx: 13, ox: 15, range: 90, spd: 1.0, type: 'weather', label: 'REGEN', zone: 'munich' }
    ];

    new IntersectionObserver(function (e) { gVis = e[0].isIntersecting; }, { threshold: 0.1 }).observe(gc);

    function gInit() {
        pl = { x: 80, y: 310, vx: 0, vy: 0, grounded: false, right: true };
        cam = { x: 0 };
        plats = PLATS.map(function (p) { return Object.assign({}, p); });
        colls = COLLS.map(function (c) { return Object.assign({}, c, { collected: false, bob: Math.random() * 6.28 }); });
        parts = [];
        scr = {
            skills: 0, totalSkills: COLLS.filter(function (c) { return c.type === 'skill'; }).length,
            esp: 0, totalEsp: COLLS.filter(function (c) { return c.type === 'espresso'; }).length,
            prt: 0, totalPrt: COLLS.filter(function (c) { return c.type === 'pretzel'; }).length
        };
        espT = 0; wlk = 0; role = 'Student'; t0 = Date.now();
        shakeT = 0; confetti = []; bubble = null; wasGrounded = false; hitCooldown = 0;
        zoneTransition = null; hasDoubleJump = false; djUsed = false; notify = null;
        enemies = ENEMIES.map(function (e) {
            const p = plats[e.platIdx];
            return {
                x: p.x + e.ox, y: p.y - 14,
                x0: p.x + e.ox, x1: p.x + e.ox + e.range,
                spd: e.spd, dir: 1, label: e.label, zone: e.zone,
                type: e.type, platIdx: e.platIdx, ox: e.ox, range: e.range
            };
        });
        gs = 'playing';
        document.getElementById('game-start').style.display = 'none';
        document.getElementById('game-win').style.display = 'none';
        document.getElementById('game-hud').style.display = 'flex';
        document.getElementById('game-touch').classList.add('active');
        MusicController.init();
        MusicController.reset();
    }

    function gUpdate() {
        if (gs !== 'playing') return;
        let mx = 0;
        if (gk.ArrowRight || gk.KeyD || gk.right) mx = 1;
        if (gk.ArrowLeft || gk.KeyA || gk.left) mx = -1;
        const spd = espT > 0 ? MSPD * 1.5 : MSPD;
        pl.vx = mx * spd;
        if (mx > 0) pl.right = true;
        if (mx < 0) pl.right = false;

        if (gk.Space || gk.ArrowUp || gk.KeyW || gk.jump) {
            if (pl.grounded) {
                pl.vy = JFORCE;
                pl.grounded = false;
                djUsed = false;
            } else if (hasDoubleJump && !djUsed && !gk._jumpHeld) {
                pl.vy = JFORCE * 0.85;
                djUsed = true;
                // Sparkle burst for double jump
                for (let j = 0; j < 8; j++) {
                    parts.push({
                        x: pl.x + PW / 2 + (Math.random() - 0.5) * 12,
                        y: pl.y + PH,
                        vx: (Math.random() - 0.5) * 4,
                        vy: Math.random() * 2 + 0.5,
                        life: 18, color: '#f7df1e'
                    });
                }
            }
            gk._jumpHeld = true;
        } else {
            gk._jumpHeld = false;
        }

        pl.vy += GRAV;
        pl.x += pl.vx;
        pl.y += pl.vy;
        if (pl.x < 0) pl.x = 0;
        if (pl.y > GH + 100) { /* do nothing, handled below */ }
        if (hitCooldown > 0) hitCooldown--;

        // Boss Logic
        if (boss && !boss.dead) {
            // Activation - earlier
            if (!boss.active && pl.x > 2000) boss.active = true;

            if (boss.active) {
                boss.t += 0.05;
                // Hover movement
                boss.y = 90 + Math.sin(boss.t) * 60;

                // Shoot
                boss.shootT++;
                if (boss.shootT > 90) { // Fire every ~1.5s
                    boss.shootT = 0;
                    bullets.push({ x: boss.x, y: boss.y + 10, w: 10, h: 10, vx: -4, vy: 0, life: 200 });
                }
            }
        }

        // Update Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.vx;
            b.life--;
            if (b.life <= 0 || b.remove) bullets.splice(i, 1);
        }

        // Win condition (reaching the flag/end) - simplified
        // Check both position AND flag collision fallback
        const atFlag = (pl.x > 3100) || (Math.abs(pl.x + PW / 2 - FLAG.x) < 20 && pl.y + PH > FLAG.pY - 48);

        if (atFlag && (!boss || boss.dead)) { // Win only if boss is dead or doesn't exist
            gWin();
        }

        if (Math.abs(pl.vx) > 0.5 && pl.grounded) wlk += 0.2;
        else wlk = 0;

        // Moving platforms
        for (let i = 0; i < plats.length; i++) {
            const p = plats[i];
            if (p.moving) {
                if (!p.mdir) p.mdir = 1;
                const oldX = p.x;
                p.x += p.mspd * p.mdir;
                if (p.x >= p.mx1) { p.x = p.mx1; p.mdir = -1; }
                if (p.x <= p.mx0) { p.x = p.mx0; p.mdir = 1; }
                p.mdx = p.x - oldX; // track delta for carrying player
            } else {
                p.mdx = 0;
            }
        }

        // Platform collision
        wasGrounded = pl.grounded;
        pl.grounded = false;
        for (let i = 0; i < plats.length; i++) {
            const p = plats[i];
            if (pl.x + PW > p.x + 4 && pl.x < p.x + p.w - 4) {
                const feet = pl.y + PH;
                const prev = feet - pl.vy;
                if (pl.vy >= 0 && prev <= p.y + 6 && feet >= p.y) {
                    pl.y = p.y - PH;
                    pl.vy = 0;
                    pl.grounded = true;
                    // Carry player on moving platform
                    if (p.mdx) pl.x += p.mdx;
                    // Dust particles on landing
                    if (!wasGrounded) {
                        for (let j = 0; j < 6; j++) {
                            parts.push({
                                x: pl.x + PW / 2 + (Math.random() - 0.5) * PW,
                                y: p.y,
                                vx: (Math.random() - 0.5) * 3,
                                vy: -Math.random() * 1.5 - 0.5,
                                life: 15 + Math.random() * 10,
                                color: p.zone === 'rome' ? '#c0a080' : '#8090a0'
                            });
                        }
                    }
                    // Speech bubble on career platforms
                    if (!wasGrounded && p.label && p.role) {
                        const msgs = p.zone === 'rome'
                            ? ['Ciao!', 'Andiamo!', 'Forza!', 'Mamma mia!', 'Bene!']
                            : ['Servus!', 'Prost!', 'Auf geht\'s!', 'Jawohl!', 'Genau!'];
                        if (p.final) {
                            bubble = { x: pl.x + PW / 2, y: p.y - 20, text: 'Let\'s ship it!', life: 120 };
                        } else {
                            bubble = { x: pl.x + PW / 2, y: p.y - 20, text: msgs[Math.floor(Math.random() * msgs.length)], life: 90 };
                        }
                    }
                    if (p.role) role = p.role;
                }
            }
        }

        // Fall respawn with screen shake
        if (pl.y > GH + 60) {
            // Bullet collision moved to main loop

            let best = plats[0];
            for (let i = 0; i < plats.length; i++) {
                if (plats[i].x + plats[i].w < pl.x + 150 && plats[i].x >= best.x) best = plats[i];
            }
            pl.x = best.x + best.w / 2 - PW / 2;
            pl.y = best.y - PH - 30;
            pl.vy = 0; pl.vx = 0;
            shakeT = 12;
        }

        // Screen shake decay
        if (shakeT > 0) shakeT--;

        // Speech bubble decay
        if (bubble) { bubble.life--; bubble.y -= 0.3; if (bubble.life <= 0) bubble = null; }

        // Collectibles
        for (let i = 0; i < colls.length; i++) {
            const c = colls[i];
            if (c.collected) continue;
            const dx = (c.x + 10) - (pl.x + PW / 2);
            const dy = (c.y + 10) - (pl.y + PH / 2);
            if (Math.hypot(dx, dy) < 22) {
                c.collected = true;
                const pcolor = c.type === 'espresso' ? '#6f4e37' : c.type === 'pretzel' ? '#c8851e' : (c.color || '#7eb8ff');
                if (c.type === 'espresso') { espT = 120; scr.esp++; }
                else if (c.type === 'pretzel') { scr.prt++; }
                else {
                    scr.skills++;
                    // Unlock double jump at 6 skills
                    if (scr.skills >= 6 && !hasDoubleJump) {
                        hasDoubleJump = true;
                        notify = { text: 'Double Jump Unlocked!', life: 150, color: '#f7df1e' };
                    }
                }
                for (let j = 0; j < 10; j++) {
                    parts.push({ x: c.x + 10, y: c.y + 10, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 1, life: 30, color: pcolor });
                }
            }
        }

        // Bullet collision
        for (let i = 0; i < bullets.length; i++) {
            const b = bullets[i];
            if (pl.x < b.x + b.w && pl.x + PW > b.x &&
                pl.y < b.y + b.h && pl.y + PH > b.y) {
                // Knockback
                pl.vx = -8;
                pl.vy = -4;
                hitCooldown = 60;
                b.remove = true;
            }
        }

        // Enemy update & collision
        // hitCooldown is handled at the top of gUpdate now
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            // Sync with moving platforms
            const p = plats[e.platIdx];
            e.x0 = p.x + e.ox;
            e.x1 = p.x + e.ox + e.range;
            e.y = p.y - 14;
            // Patrol
            e.x += e.spd * e.dir;
            if (e.x >= e.x1) { e.x = e.x1; e.dir = -1; }
            if (e.x <= e.x0) { e.x = e.x0; e.dir = 1; }
            // Collision with player (12x14 hitbox for enemy)
            if (hitCooldown <= 0 &&
                pl.x + PW > e.x + 2 && pl.x < e.x + 12 &&
                pl.y + PH > e.y + 2 && pl.y < e.y + 14) {
                // Knock player back
                pl.vy = -7;
                pl.vx = (pl.x + PW / 2 < e.x + 6) ? -5 : 5;
                pl.grounded = false;
                hitCooldown = 40;
                shakeT = 6;
                // Particle burst (color varies by type)
                var pCol = e.type === 'bureaucracy' ? '#cc3333' : e.type === 'homesick' ? '#e75480' : '#6090b0';
                for (let j = 0; j < 8; j++) {
                    parts.push({
                        x: e.x + 6, y: e.y + 7,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 0.5) * 5 - 1,
                        life: 20, color: pCol
                    });
                }
                // Bubble text varies by type
                var bText;
                if (e.type === 'bureaucracy') bText = e.zone === 'rome' ? 'Burocrazia!' : 'Bürokratie!';
                else if (e.type === 'homesick') bText = e.zone === 'rome' ? 'Mi manchi mamma!' : 'Ich vermisse Pizza!';
                else bText = 'So much rain!';
                bubble = { x: pl.x + PW / 2, y: pl.y - 10, text: bText, life: 70 };
            }
        }

        // Flag collision — win when player reaches the Bavarian flag
        if (gs === 'playing' && Math.abs(pl.x + PW / 2 - FLAG.x) < 18 && pl.y + PH > FLAG.pY - 48) {
            // This is now handled by the boss logic
            // gWin();
        }

        // Particles
        parts = parts.filter(function (p) {
            p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
            return p.life > 0;
        });

        if (espT > 0) espT--;

        // Zone transition trigger (flight from Rome to Munich)
        if (!zoneTransition && pl.x > ZONE_BORDER && pl.x < ZONE_BORDER + 40) {
            zoneTransition = { life: 180, phase: 0 }; // ~3 seconds at 60fps
        }
        if (zoneTransition) {
            zoneTransition.life--;
            zoneTransition.phase = 1 - (zoneTransition.life / 180);
            if (zoneTransition.life <= 0) zoneTransition = null;
        }

        // Notification decay
        if (notify) { notify.life--; if (notify.life <= 0) notify = null; }

        // Camera
        const tx = pl.x - GW * 0.3;
        cam.x += (tx - cam.x) * 0.08;
        if (cam.x < 0) cam.x = 0;

        // HUD with live speedrun timer
        const elapsed = Math.floor((Date.now() - t0) / 1000);
        const em = Math.floor(elapsed / 60);
        const es = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('game-role').textContent = role + '  \u23F1 ' + em + ':' + es;
        document.getElementById('game-skills').textContent =
            '\u2615 ' + scr.esp + '/' + scr.totalEsp +
            '  \uD83E\uDD68 ' + scr.prt + '/' + scr.totalPrt +
            '  \u26A1 ' + scr.skills + '/' + scr.totalSkills;
    }

    function gWin() {
        if (gs !== 'playing') return;
        gs = 'won';
        const sec = Math.round((Date.now() - t0) / 1000);
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toString().padStart(2, '0');

        // Personal best check
        var isNewPB = false;
        try {
            var prev = localStorage.getItem('cc_pb');
            if (!prev || sec < parseInt(prev, 10)) {
                localStorage.setItem('cc_pb', sec.toString());
                isNewPB = true;
            }
            // Also save best collectible count
            var totalC = scr.skills + scr.esp + scr.prt;
            var totalMax = scr.totalSkills + scr.totalEsp + scr.totalPrt;
            var prevC = localStorage.getItem('cc_pb_collect');
            if (!prevC || totalC > parseInt(prevC, 10)) {
                localStorage.setItem('cc_pb_collect', totalC.toString());
                localStorage.setItem('cc_pb_collect_max', totalMax.toString());
            }
        } catch (e) { } // localStorage may be unavailable

        // Spawn confetti (Bavarian blue & white + gold)
        var cColors = ['#0078ba', '#ffffff', '#0078ba', '#ffffff', '#ddb44a', '#7eb8ff'];
        if (isNewPB) cColors.push('#f7df1e', '#f7df1e'); // extra gold for new PB
        for (let i = 0; i < 80; i++) {
            confetti.push({
                x: Math.random() * GW,
                y: -Math.random() * GH * 0.5,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 2 + 1,
                rot: Math.random() * 6.28,
                rotV: (Math.random() - 0.5) * 0.2,
                w: 4 + Math.random() * 4,
                h: 3 + Math.random() * 2,
                color: cColors[Math.floor(Math.random() * cColors.length)],
                life: 200 + Math.random() * 100
            });
        }

        // Delay showing the overlay so confetti plays first
        var _isNewPB = isNewPB, _scr = scr, _m = m, _s = s;
        setTimeout(function () {
            document.getElementById('game-hud').style.display = 'none';
            document.getElementById('game-touch').classList.remove('active');
            var html =
                '\u2615 Espressos: ' + _scr.esp + '/' + _scr.totalEsp +
                '<br>\uD83E\uDD68 Pretzels: ' + _scr.prt + '/' + _scr.totalPrt +
                '<br>\u26A1 Skills: ' + _scr.skills + '/' + _scr.totalSkills +
                '<br>\u23F1 Time: ' + _m + 'm ' + _s + 's';
            if (_isNewPB) html += '<br><span style="color:#f7df1e;font-weight:bold">\uD83C\uDFC6 New Personal Best!</span>';
            document.getElementById('game-stats').innerHTML = html;
            document.getElementById('game-win').style.display = 'flex';
        }, 1500);
    }

    // Draw Functions (shortened for brevity, include full implementation)
    function rr(x, y, w, h, r) {
        cx.beginPath();
        cx.moveTo(x + r, y); cx.lineTo(x + w - r, y);
        cx.quadraticCurveTo(x + w, y, x + w, y + r); cx.lineTo(x + w, y + h - r);
        cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); cx.lineTo(x + r, y + h);
        cx.quadraticCurveTo(x, y + h, x, y + h - r); cx.lineTo(x, y + r);
        cx.quadraticCurveTo(x, y, x + r, y); cx.closePath();
    }

    // ... (Include other draw functions like gGetCostume, gDrawChar, gDrawEspresso, gDrawPretzel, gDrawSkillOrb, gDrawEnemy, gDrawPlat, gDrawColl, gDrawBg from original code) ...
    // NOTE: For the sake of the token limit I will assume I need to supply these.
    // I will write the rest of the draw functions in a subsequent step or appending to this file if I can.
    // Actually I must provide the full content here or it will be incomplete.
    // I'll try to include as much as possible, focusing on correctness.

    // [OMITTED SOME DRAW FUNCTIONS FOR SIZE - WILL APPEND IN NEXT STEP]
    // Ideally I should write the full file.

    function gGetCostume() {
        switch (role) {
            case 'Student': return { hair: 'messy', shirt: '#5a9fd4', pants: '#4a6a8a', shoes: '#666', hat: null, collar: false };
            case 'Junior Dev': return { hair: 'messy', shirt: '#6fbf73', pants: '#4a6a8a', shoes: '#555', hat: null, collar: false };
            case 'Founder & CEO': return { hair: 'neat', shirt: '#e85d4a', pants: '#333', shoes: '#222', hat: null, collar: true };
            case 'Teacher': return { hair: 'neat', shirt: '#f5c542', pants: '#3a3a3a', shoes: '#444', hat: null, collar: true };
            case 'Software Dev': return { hair: 'neat', shirt: '#7eb8ff', pants: '#3a5070', shoes: '#555', hat: 'beanie', collar: false };
            case 'Full-Stack Dev': return { hair: 'neat', shirt: '#8b5cf6', pants: '#2a3a5c', shoes: '#444', hat: 'beanie', collar: false };
            case 'Sr Frontend Dev': return { hair: 'neat', shirt: '#0078ba', pants: '#2a3a5c', shoes: '#333', hat: 'tyrolean', collar: false };
            case 'Eng Manager': return { hair: 'neat', shirt: '#1a5276', pants: '#222', shoes: '#222', hat: 'tyrolean', collar: true };
            case 'Sr Eng Manager': return { hair: 'neat', shirt: '#0078ba', pants: '#1a1a2e', shoes: '#222', hat: 'tyrolean', collar: true };
            default: return { hair: 'messy', shirt: '#7eb8ff', pants: '#2a3a5c', shoes: '#444', hat: null, collar: false };
        }
    }

    // ... (Moving to part 2 of file creation to ensure no cutoffs)

    function gLoop() {
        if (gs === 'playing') {
            gUpdate();
            // Update music system
            if (MusicController.initialized && !MusicController.muted) {
                MusicController.checkZone(pl.x);
                MusicController.schedule();
            }
        }
        if (gVis || gs === 'playing' || gs === 'won') gDraw();
        requestAnimationFrame(gLoop);
    }

    // Expose these for Main.js to attach listeners
    window.gInit = gInit;
    window.gShowPB = gShowPB;
    window.gk = gk;

    // Input
    document.addEventListener('keydown', function (e) {
        if (document.getElementById('cmdPalette').classList.contains('active')) return;
        if (gs === 'playing' && gVis) {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
        }
        gk[e.code] = true;
    });
    document.addEventListener('keyup', function (e) { gk[e.code] = false; });

    // Touch controls
    const tbs = document.querySelectorAll('.game-touch-btn');
    tbs.forEach(function (btn) {
        const act = btn.dataset.action;
        btn.addEventListener('touchstart', function (e) { e.preventDefault(); gk[act] = true; });
        btn.addEventListener('touchend', function (e) { e.preventDefault(); gk[act] = false; });
    });

    // Load & display personal best on start screen
    function gShowPB() {
        try {
            var pb = localStorage.getItem('cc_pb');
            if (pb) {
                var s = parseInt(pb, 10);
                var pm = Math.floor(s / 60);
                var ps = (s % 60).toString().padStart(2, '0');
                var txt = '\u23F1 Best: ' + pm + 'm ' + ps + 's';
                var pc = localStorage.getItem('cc_pb_collect');
                var pcm = localStorage.getItem('cc_pb_collect_max');
                if (pc && pcm) txt += '  \u00B7  \u2B50 ' + pc + '/' + pcm;
                document.getElementById('game-pb').textContent = txt;
            }
        } catch (e) { }
    }
    gShowPB();

    gLoop();

    function gDrawIdle() {
        cx.clearRect(0, 0, GW, GH);
        // Draw background and world (static)
        gDrawBg();
        cx.save();
        cx.translate(Math.round(-cam.x), 0);
        for (let i = 0; i < plats.length; i++) gDrawPlat(plats[i]);
        for (let i = 0; i < colls.length; i++) {
            if (!colls[i].collected) gDrawColl(colls[i]);
        }
        for (let i = 0; i < enemies.length; i++) gDrawEnemy(enemies[i]);
        gDrawChar();
        cx.restore();

        // Dark dim for title
        cx.fillStyle = 'rgba(0,0,0,0.3)';
        cx.fillRect(0, 0, GW, GH);
    }

    // Placeholder functions for the ones I haven't implemented here yet to avoid runtime errors if run partially
    // I will implement them in the replace_content call next.
    function gDraw() {
        cx.clearRect(0, 0, GW, GH);
        if (gs === 'idle') { gDrawIdle(); return; }

        // Screen shake offset
        let sx = 0, sy = 0;
        if (shakeT > 0) {
            sx = (Math.random() - 0.5) * shakeT * 1.2;
            sy = (Math.random() - 0.5) * shakeT * 1.2;
        }

        cx.save();
        cx.translate(sx, sy);

        gDrawBg();
        cx.save();
        cx.translate(Math.round(-cam.x), 0);
        for (let i = 0; i < plats.length; i++) gDrawPlat(plats[i]);
        for (let i = 0; i < colls.length; i++) if (!colls[i].collected) gDrawColl(colls[i]);
        for (let i = 0; i < enemies.length; i++) gDrawEnemy(enemies[i]);
        gDrawChar();

        // Draw Boss (The Glitch)
        // Draw even if inactive so we can see it waiting
        if (boss && !boss.dead) {
            // Context is already translated by -cam.x, so use world coordinates directly
            const bx = boss.x;
            const by = boss.y;
            cx.save();

            // Glitch effect
            if (boss.active) {
                for (let i = 0; i < 3; i++) {
                    cx.fillStyle = i === 0 ? 'red' : (i === 1 ? 'black' : '#550000');
                    const offX = (Math.random() - 0.5) * 10;
                    const offY = (Math.random() - 0.5) * 10;
                    cx.fillRect(bx + offX, by + offY, boss.w, boss.h);
                }
            } else {
                // Sleeping glitch (static)
                cx.fillStyle = '#880000';
                cx.fillRect(bx, by, boss.w, boss.h);
            }
            // "Eyes"
            cx.fillStyle = '#fff';
            cx.fillRect(bx + 5, by + 10, 8, 8);
            cx.fillRect(bx + 25, by + 10, 8, 8);
            // Label
            cx.fillStyle = 'red';
            cx.font = 'bold 12px monospace';
            cx.fillText('THE_GLITCH', bx - 10, by - 10);
            cx.restore();
        }

        // Draw Bullets
        cx.fillStyle = '#ff3333';
        for (let i = 0; i < bullets.length; i++) {
            const b = bullets[i];
            // Context is already translated by -cam.x
            cx.fillRect(b.x, b.y, b.w, b.h);
        }

        // Particles (dust + collect)
        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            cx.globalAlpha = Math.min(1, p.life / 20);
            cx.fillStyle = p.color;
            const sz = p.life > 15 ? 4 : p.life > 8 ? 3 : 2;
            cx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
        cx.globalAlpha = 1;

        // Speech bubble
        if (bubble) {
            const ba = Math.min(1, bubble.life / 20);
            cx.globalAlpha = ba;
            cx.font = 'bold 9px "DM Sans",sans-serif';
            cx.fillStyle = '#fff';
            const bw = cx.measureText(bubble.text).width + 12;
            const bh = 16;
            const bx = bubble.x - bw / 2;
            const by = bubble.y - bh;
            rr(bx, by, bw, bh, 6); cx.fill();
            // Tail
            cx.beginPath();
            cx.moveTo(bubble.x - 4, by + bh);
            cx.lineTo(bubble.x, by + bh + 5);
            cx.lineTo(bubble.x + 4, by + bh);
            cx.closePath(); cx.fill();
            // Text
            cx.fillStyle = '#1a1a1c';
            cx.textAlign = 'center';
            cx.textBaseline = 'middle';
            cx.fillText(bubble.text, bubble.x, by + bh / 2);
            cx.textAlign = 'left';
            cx.textBaseline = 'alphabetic';
            cx.globalAlpha = 1;
        }

        cx.restore(); // end world-space

        // Espresso indicator
        if (espT > 0) {
            cx.fillStyle = 'rgba(255,153,0,0.12)';
            cx.fillRect(0, 0, GW, GH);
        }

        // Zone transition overlay (flight FCO → MUC)
        if (zoneTransition) {
            var zt = zoneTransition;
            var zp = zt.phase;
            // Fade in, hold, fade out
            var za;
            if (zp < 0.15) za = zp / 0.15;          // fade in
            else if (zp < 0.85) za = 1;              // hold
            else za = (1 - zp) / 0.15;               // fade out
            za = Math.max(0, Math.min(1, za));

            // Dark overlay
            cx.fillStyle = 'rgba(10,10,20,' + (za * 0.75) + ')';
            cx.fillRect(0, 0, GW, GH);

            cx.globalAlpha = za;

            // Boarding pass card
            var bpW = 320, bpH = 90;
            var bpX = (GW - bpW) / 2, bpY = (GH - bpH) / 2;
            // Card background
            cx.fillStyle = '#f5f0e0';
            rr(bpX, bpY, bpW, bpH, 8); cx.fill();
            // Perforated edge
            cx.setLineDash([4, 4]);
            cx.strokeStyle = '#ccc';
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(bpX + bpW * 0.7, bpY + 6);
            cx.lineTo(bpX + bpW * 0.7, bpY + bpH - 6);
            cx.stroke();
            cx.setLineDash([]);
            // Airline header
            cx.fillStyle = '#0078ba';
            cx.fillRect(bpX, bpY, bpW, 18);
            rr(bpX, bpY, bpW, 18, 8); cx.fill();
            cx.fillRect(bpX, bpY + 10, bpW, 8);
            cx.fillStyle = '#fff';
            cx.font = 'bold 10px "DM Sans",sans-serif';
            cx.textAlign = 'center';
            cx.fillText('CAREER AIRLINES', bpX + bpW / 2, bpY + 12);
            // FROM → TO
            cx.fillStyle = '#333';
            cx.font = 'bold 22px "DM Sans",sans-serif';
            cx.textAlign = 'left';
            cx.fillText('FCO', bpX + 20, bpY + 48);
            cx.textAlign = 'right';
            cx.fillText('MUC', bpX + bpW * 0.65, bpY + 48);
            // City names
            cx.font = '9px "DM Sans",sans-serif';
            cx.fillStyle = '#888';
            cx.textAlign = 'left';
            cx.fillText('Roma Fiumicino', bpX + 20, bpY + 60);
            cx.textAlign = 'right';
            cx.fillText('München', bpX + bpW * 0.65, bpY + 60);
            // Airplane between codes
            cx.textAlign = 'center';
            var planeX = bpX + 80 + zp * 60;
            cx.font = '14px sans-serif';
            cx.fillStyle = '#0078ba';
            cx.fillText('\u2708', planeX, bpY + 46);
            // Dotted flight path
            cx.setLineDash([2, 3]);
            cx.strokeStyle = 'rgba(0,120,186,0.3)';
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(bpX + 65, bpY + 43);
            cx.lineTo(bpX + bpW * 0.6, bpY + 43);
            cx.stroke();
            cx.setLineDash([]);
            // Passenger name
            cx.fillStyle = '#333';
            cx.font = '8px "DM Sans",sans-serif';
            cx.textAlign = 'left';
            cx.fillText('PASSENGER', bpX + 20, bpY + 74);
            cx.font = 'bold 10px "DM Sans",sans-serif';
            cx.fillText('PIZZARI / RAFFAELE', bpX + 20, bpY + 84);
            // Seat & Gate on right stub
            cx.font = '8px "DM Sans",sans-serif';
            cx.fillStyle = '#888';
            cx.textAlign = 'left';
            cx.fillText('SEAT', bpX + bpW * 0.72, bpY + 38);
            cx.fillText('GATE', bpX + bpW * 0.72, bpY + 58);
            cx.fillText('BOARDING', bpX + bpW * 0.72, bpY + 78);
            cx.font = 'bold 11px "DM Sans",sans-serif';
            cx.fillStyle = '#333';
            cx.fillText('14A', bpX + bpW * 0.72, bpY + 48);
            cx.fillText('B7', bpX + bpW * 0.72, bpY + 68);
            cx.fillText('NOW', bpX + bpW * 0.72, bpY + 88);

            cx.textAlign = 'left';
            cx.globalAlpha = 1;
        }

        // Notification banner (e.g. "Double Jump Unlocked!")
        if (notify) {
            var na = Math.min(1, notify.life / 20);
            if (notify.life > 130) na = (150 - notify.life) / 20; // fade in
            cx.globalAlpha = na;
            cx.fillStyle = 'rgba(10,10,20,0.7)';
            var nw = 200, nh = 28;
            var nx = (GW - nw) / 2, ny = 50;
            rr(nx, ny, nw, nh, 6); cx.fill();
            cx.strokeStyle = notify.color;
            cx.lineWidth = 1.5;
            rr(nx, ny, nw, nh, 6); cx.stroke();
            cx.fillStyle = notify.color;
            cx.font = 'bold 11px "DM Sans",sans-serif';
            cx.textAlign = 'center';
            cx.textBaseline = 'middle';
            cx.fillText(notify.text, GW / 2, ny + nh / 2);
            cx.textAlign = 'left';
            cx.textBaseline = 'alphabetic';
            cx.globalAlpha = 1;
        }

        // Confetti (screen-space)
        if (confetti.length > 0) {
            confetti = confetti.filter(function (c) {
                c.x += c.vx; c.y += c.vy; c.vy += 0.02;
                c.vx *= 0.99; c.rot += c.rotV; c.life--;
                if (c.life <= 0) return false;
                cx.save();
                cx.translate(c.x, c.y);
                cx.rotate(c.rot);
                cx.globalAlpha = Math.min(1, c.life / 40);
                cx.fillStyle = c.color;
                cx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                cx.restore();
                return true;
            });
            cx.globalAlpha = 1;
        }

        cx.restore(); // end shake
    }
    function gDrawChar() {
        const px = Math.round(pl.x);
        const py = Math.round(pl.y);
        const c = gGetCostume();
        cx.save();
        if (!pl.right) {
            cx.translate(px + PW, 0);
            cx.scale(-1, 1);
        } else {
            cx.translate(px, 0);
        }

        // Hit flash
        if (hitCooldown > 30) {
            cx.globalAlpha = 0.4 + Math.sin(hitCooldown * 2) * 0.3;
        }

        if (espT > 0) {
            cx.shadowColor = '#ff9900';
            cx.shadowBlur = 12;
        }

        // Hat / headgear (behind hair)
        if (c.hat === 'tyrolean') {
            // Tyrolean hat — dark green with red band
            cx.fillStyle = '#2d5a27';
            cx.fillRect(1, py - 3, 16, 4);  // brim
            cx.fillRect(4, py - 7, 10, 5);  // crown
            cx.fillStyle = '#c0392b';
            cx.fillRect(4, py - 3, 10, 2);  // red band
            // Little feather
            cx.fillStyle = '#f5d76e';
            cx.fillRect(13, py - 9, 2, 4);
            cx.fillRect(14, py - 10, 1, 2);
        } else if (c.hat === 'beanie') {
            // Beanie
            cx.fillStyle = '#444';
            cx.fillRect(2, py - 2, 14, 4);
            cx.fillRect(5, py - 4, 8, 3);
            cx.fillStyle = '#666';
            cx.fillRect(4, py - 1, 10, 1); // stripe
        }

        // Hair
        cx.fillStyle = '#3a2518';
        if (c.hair === 'messy') {
            cx.fillRect(3, py, 12, 4);
            cx.fillRect(1, py + 2, 3, 3);
            cx.fillRect(14, py + 1, 2, 2); // wisp
        } else {
            cx.fillRect(3, py + 1, 12, 3);
            cx.fillRect(2, py + 2, 2, 2);
        }

        // Head
        cx.fillStyle = '#f0c090';
        cx.fillRect(3, py + 3, 12, 8);

        // Eye
        cx.fillStyle = '#222';
        cx.fillRect(11, py + 5, 2, 2);

        // Mouth
        cx.fillStyle = '#c08060';
        cx.fillRect(10, py + 8, 3, 1);

        // Beard (appears in Munich zone roles)
        if (c.hat === 'tyrolean' || c.hat === 'beanie') {
            cx.fillStyle = 'rgba(58,37,24,0.5)';
            cx.fillRect(9, py + 9, 5, 2);
        }

        // Shirt / top
        cx.fillStyle = espT > 0 ? '#ff9944' : c.shirt;
        cx.fillRect(2, py + 11, 14, 8);

        // Collar (for formal roles)
        if (c.collar) {
            cx.fillStyle = '#fff';
            cx.fillRect(6, py + 11, 6, 2);
            // V-shape collar
            cx.fillRect(7, py + 13, 1, 1);
            cx.fillRect(10, py + 13, 1, 1);
        }

        // Arms
        cx.fillStyle = '#f0c090';
        const arm = pl.grounded && Math.abs(pl.vx) > 0.5 ? Math.sin(wlk * 5) * 2 : 0;
        cx.fillRect(0, py + 12 + arm, 3, 5);
        cx.fillRect(15, py + 12 - arm, 3, 5);

        // Pants
        cx.fillStyle = c.pants;
        if (pl.grounded && Math.abs(pl.vx) > 0.5) {
            const s = Math.sin(wlk * 5) * 2;
            cx.fillRect(3, py + 19, 5, Math.max(3, 6 + s));
            cx.fillRect(10, py + 19, 5, Math.max(3, 6 - s));
        } else if (!pl.grounded) {
            cx.fillRect(4, py + 19, 4, 5);
            cx.fillRect(10, py + 19, 4, 5);
        } else {
            cx.fillRect(3, py + 19, 5, 7);
            cx.fillRect(10, py + 19, 5, 7);
        }

        // Lederhosen suspenders (Tyrolean hat roles)
        if (c.hat === 'tyrolean') {
            cx.fillStyle = '#8B4513';
            cx.fillRect(5, py + 11, 1, 8);
            cx.fillRect(12, py + 11, 1, 8);
            cx.fillRect(5, py + 18, 8, 1); // belt
        }

        // Shoes
        cx.fillStyle = c.shoes;
        cx.fillRect(2, py + PH - 2, 6, 2);
        cx.fillRect(10, py + PH - 2, 6, 2);

        cx.shadowBlur = 0;
        cx.globalAlpha = 1;
        cx.restore();
    }

    function gDrawEnemy(e) {
        if (e.type === 'bureaucracy') gDrawEnemyBureaucracy(e);
        else if (e.type === 'homesick') gDrawEnemyHomesick(e);
        else if (e.type === 'weather') gDrawEnemyWeather(e);
    }

    // ── Bureaucracy enemy: angry walking paperwork ──
    function gDrawEnemyBureaucracy(e) {
        const ex = Math.round(e.x), ey = Math.round(e.y), t = Date.now();
        const bob = Math.sin(t / 250 + ex) * 1.5;
        cx.save();
        if (e.dir < 0) { cx.translate(ex + 12, 0); cx.scale(-1, 1); }
        else cx.translate(ex, 0);

        // Shadow
        cx.fillStyle = 'rgba(0,0,0,0.15)';
        cx.fillRect(1, ey + 14, 10, 2);
        // Paper body
        cx.fillStyle = '#f5f0e0';
        cx.fillRect(1, ey + bob, 10, 12);
        // Folded corner
        cx.fillStyle = '#e0d8c0';
        cx.beginPath();
        cx.moveTo(8, ey + bob); cx.lineTo(11, ey + bob + 3); cx.lineTo(8, ey + bob + 3);
        cx.closePath(); cx.fill();
        // Red tape stripes
        cx.fillStyle = '#cc3333';
        cx.fillRect(2, ey + bob + 2, 6, 1.5);
        cx.fillRect(2, ey + bob + 5, 7, 1.5);
        cx.fillRect(2, ey + bob + 8, 5, 1.5);
        // Angry eyes
        cx.fillStyle = '#222';
        cx.fillRect(3, ey + bob + 3, 2, 2);
        cx.fillRect(7, ey + bob + 3, 2, 2);
        // Angry eyebrows
        cx.fillStyle = '#cc3333';
        cx.fillRect(2, ey + bob + 2, 3, 1);
        cx.fillRect(7, ey + bob + 2, 3, 1);
        // Legs
        cx.fillStyle = '#222';
        const legA = Math.sin(t / 100) * 1.5;
        cx.fillRect(2, ey + bob + 12, 2, 2 + legA);
        cx.fillRect(8, ey + bob + 12, 2, 2 - legA);
        // Label
        cx.fillStyle = 'rgba(204,51,51,0.7)';
        cx.font = 'bold 6px monospace'; cx.textAlign = 'center';
        cx.fillText(e.label, 6, ey + bob - 2);
        cx.textAlign = 'left';
        cx.restore();
    }

    // ── Homesick enemy: sad suitcase with a broken heart ──
    function gDrawEnemyHomesick(e) {
        const ex = Math.round(e.x), ey = Math.round(e.y), t = Date.now();
        const bob = Math.sin(t / 300 + ex) * 2;
        cx.save();
        if (e.dir < 0) { cx.translate(ex + 12, 0); cx.scale(-1, 1); }
        else cx.translate(ex, 0);

        // Shadow
        cx.fillStyle = 'rgba(0,0,0,0.12)';
        cx.fillRect(1, ey + 14, 10, 2);
        // Suitcase body
        cx.fillStyle = '#6b4c3b';
        cx.fillRect(1, ey + bob + 2, 10, 10);
        // Suitcase straps
        cx.fillStyle = '#8b6c5b';
        cx.fillRect(3, ey + bob + 2, 1, 10);
        cx.fillRect(8, ey + bob + 2, 1, 10);
        // Handle
        cx.fillStyle = '#4a3428';
        cx.fillRect(4, ey + bob, 4, 2);
        cx.fillRect(3, ey + bob + 1, 1, 1);
        cx.fillRect(8, ey + bob + 1, 1, 1);
        // Latch
        cx.fillStyle = '#ddb44a';
        cx.fillRect(5, ey + bob + 6, 2, 2);
        // Stickers on suitcase
        cx.fillStyle = '#cc3333'; // Italian flag hint
        cx.fillRect(5, ey + bob + 3, 1, 1);
        cx.fillStyle = '#fff';
        cx.fillRect(6, ey + bob + 3, 1, 1);
        cx.fillStyle = '#009246';
        cx.fillRect(7, ey + bob + 3, 1, 1);
        // Sad face on suitcase
        cx.fillStyle = '#222';
        cx.fillRect(4, ey + bob + 9, 1, 1);
        cx.fillRect(7, ey + bob + 9, 1, 1);
        cx.fillStyle = '#4a3428';
        cx.fillRect(5, ey + bob + 10, 2, 1); // frown
        // Floating broken heart above
        const hb = Math.sin(t / 400) * 1.5;
        cx.fillStyle = '#e75480';
        // Left half heart
        cx.fillRect(4, ey + bob - 5 + hb, 2, 1);
        cx.fillRect(3, ey + bob - 4 + hb, 3, 2);
        cx.fillRect(4, ey + bob - 2 + hb, 2, 1);
        // Right half heart (offset — cracked)
        cx.fillRect(7, ey + bob - 5 + hb, 2, 1);
        cx.fillRect(7, ey + bob - 4 + hb, 3, 2);
        cx.fillRect(7, ey + bob - 2 + hb, 2, 1);
        // Crack line
        cx.fillStyle = 'rgba(0,0,0,0.3)';
        cx.fillRect(6, ey + bob - 5 + hb, 1, 4);
        // Little wheels
        cx.fillStyle = '#333';
        cx.fillRect(2, ey + bob + 12, 2, 2);
        cx.fillRect(8, ey + bob + 12, 2, 2);
        // Label
        cx.fillStyle = 'rgba(231,84,128,0.7)';
        cx.font = 'bold 6px monospace'; cx.textAlign = 'center';
        cx.fillText(e.label, 6, ey + bob - 7);
        cx.textAlign = 'left';
        cx.restore();
    }

    // ── Bad weather enemy: grumpy rain cloud ──
    function gDrawEnemyWeather(e) {
        const ex = Math.round(e.x), ey = Math.round(e.y), t = Date.now();
        const bob = Math.sin(t / 350 + ex) * 1.5;
        cx.save();
        if (e.dir < 0) { cx.translate(ex + 14, 0); cx.scale(-1, 1); }
        else cx.translate(ex, 0);

        // Shadow
        cx.fillStyle = 'rgba(0,0,0,0.1)';
        cx.fillRect(0, ey + 14, 12, 2);
        // Cloud body (puffy shape)
        cx.fillStyle = '#708090';
        cx.fillRect(1, ey + bob + 2, 10, 6);
        cx.fillRect(0, ey + bob + 3, 12, 4);
        // Cloud top bumps
        cx.fillRect(2, ey + bob, 4, 3);
        cx.fillRect(6, ey + bob + 1, 4, 2);
        // Darker underside
        cx.fillStyle = '#556677';
        cx.fillRect(1, ey + bob + 6, 10, 2);
        // Angry eyes
        cx.fillStyle = '#222';
        cx.fillRect(3, ey + bob + 3, 2, 2);
        cx.fillRect(7, ey + bob + 3, 2, 2);
        // Angry eyebrows (slanted)
        cx.fillStyle = '#445566';
        cx.fillRect(2, ey + bob + 2, 3, 1);
        cx.fillRect(7, ey + bob + 2, 3, 1);
        // Grumpy mouth
        cx.fillStyle = '#333';
        cx.fillRect(5, ey + bob + 6, 3, 1);
        // Rain drops (animated)
        cx.fillStyle = '#7eb8ff';
        for (let i = 0; i < 3; i++) {
            const rx = 2 + i * 4;
            const ry = ((t / 80 + i * 17) % 12);
            cx.fillRect(rx, ey + bob + 8 + ry, 1, 3);
        }
        // Lightning flash (occasional)
        if (Math.sin(t / 500 + ex) > 0.85) {
            cx.fillStyle = '#f7df1e';
            cx.fillRect(5, ey + bob + 8, 2, 2);
            cx.fillRect(4, ey + bob + 10, 2, 2);
            cx.fillRect(5, ey + bob + 12, 2, 2);
        }
        // Label
        cx.fillStyle = 'rgba(96,144,176,0.7)';
        cx.font = 'bold 6px monospace'; cx.textAlign = 'center';
        cx.fillText(e.label, 6, ey + bob - 2);
        cx.textAlign = 'left';
        cx.restore();
    }

    function gDrawColl(c) {
        const bob = Math.sin(Date.now() / 350 + c.bob) * 4;
        const bx = c.x, by = c.y + bob;

        if (c.type === 'espresso') {
            gDrawEspresso(bx, by);
        } else if (c.type === 'pretzel') {
            gDrawPretzel(bx, by);
        } else {
            gDrawSkillOrb(bx, by, c);
        }
    }

    // ── Pixel-art espresso cup ──
    function gDrawEspresso(x, y) {
        cx.save();
        const t = Date.now() / 250;

        // Glow
        cx.shadowColor = '#ff9944';
        cx.shadowBlur = 8;

        // Saucer
        cx.fillStyle = '#e8ddd0';
        cx.fillRect(x + 1, y + 16, 18, 3);
        cx.fillStyle = '#ccc0b0';
        cx.fillRect(x + 2, y + 18, 16, 1);

        // Cup body
        cx.fillStyle = '#f5f0eb';
        cx.fillRect(x + 4, y + 7, 11, 10);
        // Cup left edge (shadow)
        cx.fillStyle = '#d8cfc0';
        cx.fillRect(x + 4, y + 7, 2, 10);
        // Coffee inside (dark liquid)
        cx.fillStyle = '#3a1f0b';
        cx.fillRect(x + 5, y + 7, 9, 3);
        // Coffee highlight (crema)
        cx.fillStyle = '#7a4a20';
        cx.fillRect(x + 5, y + 7, 9, 1);
        // Cup rim
        cx.fillStyle = '#e8ddd0';
        cx.fillRect(x + 3, y + 6, 13, 2);
        // Handle
        cx.fillStyle = '#e0d5ca';
        cx.fillRect(x + 15, y + 9, 3, 2);
        cx.fillRect(x + 17, y + 9, 2, 5);
        cx.fillRect(x + 15, y + 13, 3, 2);

        // Steam wisps (animated)
        cx.shadowBlur = 0;
        cx.fillStyle = 'rgba(255,255,255,0.45)';
        const s1 = Math.sin(t) * 1.5;
        const s2 = Math.sin(t + 2) * 1.5;
        const s3 = Math.sin(t + 4) * 1.5;
        cx.fillRect(x + 6 + s1, y + 1, 2, 4);
        cx.fillRect(x + 9 + s2, y - 1, 2, 5);
        cx.fillRect(x + 12 + s3, y + 1, 2, 4);
        // Extra wisp detail
        cx.fillStyle = 'rgba(255,255,255,0.25)';
        cx.fillRect(x + 7 + s2, y - 2, 2, 3);
        cx.fillRect(x + 11 + s1, y - 1, 2, 3);

        cx.restore();
    }

    // ── Pixel-art pretzel ──
    function gDrawPretzel(x, y) {
        cx.save();

        // Glow
        cx.shadowColor = '#e0a030';
        cx.shadowBlur = 8;

        // Pretzel body using thick strokes
        const px = x + 10, py = y + 10;
        cx.strokeStyle = '#c8851e';
        cx.lineWidth = 4;
        cx.lineCap = 'round';
        cx.lineJoin = 'round';

        // Left loop
        cx.beginPath();
        cx.arc(px - 4, py + 3, 5, 0, Math.PI * 2);
        cx.stroke();
        // Right loop
        cx.beginPath();
        cx.arc(px + 4, py + 3, 5, 0, Math.PI * 2);
        cx.stroke();

        // Crossed arms going up to a knot at top
        cx.lineWidth = 3.5;
        cx.beginPath();
        cx.moveTo(px - 7, py - 1);
        cx.lineTo(px + 2, py - 7);
        cx.stroke();
        cx.beginPath();
        cx.moveTo(px + 7, py - 1);
        cx.lineTo(px - 2, py - 7);
        cx.stroke();

        // Top knot
        cx.lineWidth = 3;
        cx.beginPath();
        cx.moveTo(px - 2, py - 7);
        cx.quadraticCurveTo(px, py - 9, px + 2, py - 7);
        cx.stroke();

        // Highlight (lighter brown on top)
        cx.strokeStyle = '#e0a838';
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.arc(px - 4, py + 1, 4, -0.8, 0.8);
        cx.stroke();
        cx.beginPath();
        cx.arc(px + 4, py + 1, 4, Math.PI - 0.8, Math.PI + 0.8);
        cx.stroke();

        // Salt crystals
        cx.shadowBlur = 0;
        cx.fillStyle = 'rgba(255,255,255,0.85)';
        cx.fillRect(px - 6, py + 5, 2, 2);
        cx.fillRect(px + 4, py + 5, 2, 2);
        cx.fillRect(px - 1, py - 5, 2, 2);
        cx.fillRect(px - 3, py + 1, 1, 1);
        cx.fillRect(px + 3, py + 1, 1, 1);
        cx.fillRect(px + 6, py + 3, 1, 1);

        cx.restore();
    }

    // ── Pixel-art skill orb (tech coin) ──
    function gDrawSkillOrb(x, y, c) {
        cx.save();
        const bx = x + 10, by = y + 10;

        // Outer glow
        cx.shadowColor = c.color;
        cx.shadowBlur = 12;

        // Coin body
        cx.fillStyle = c.color;
        cx.beginPath();
        cx.arc(bx, by, 10, 0, Math.PI * 2);
        cx.fill();

        // Inner shine ring
        cx.shadowBlur = 0;
        cx.strokeStyle = 'rgba(255,255,255,0.3)';
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.arc(bx, by, 7.5, 0, Math.PI * 2);
        cx.stroke();

        // Specular highlight (top-left shine)
        cx.fillStyle = 'rgba(255,255,255,0.35)';
        cx.beginPath();
        cx.arc(bx - 3, by - 3, 3.5, 0, Math.PI * 2);
        cx.fill();

        // Label
        cx.fillStyle = '#fff';
        cx.font = 'bold 7px "DM Sans",sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(c.label, bx, by + 0.5);
        cx.textBaseline = 'alphabetic';

        cx.restore();
    }

    function gDrawPlat(p) {
        const rome = p.zone === 'rome';
        const sm = !p.label;
        const ph = sm ? 12 : 16;

        // Shadow
        cx.fillStyle = 'rgba(0,0,0,0.15)';
        rr(p.x + 2, p.y + 4, p.w, ph, 4);
        cx.fill();

        // Body
        cx.fillStyle = sm ? (rome ? '#7a6050' : '#3d4d60') : (rome ? '#a67c5b' : '#5a7a9f');
        rr(p.x, p.y, p.w, ph, 4);
        cx.fill();

        // Moving platform indicator
        if (p.moving) {
            const pulse = 0.3 + Math.sin(Date.now() / 300) * 0.15;
            cx.strokeStyle = 'rgba(126,184,255,' + pulse + ')';
            cx.lineWidth = 1.5;
            rr(p.x - 1, p.y - 1, p.w + 2, ph + 2, 5);
            cx.stroke();
            // Direction arrows
            cx.fillStyle = 'rgba(126,184,255,' + (pulse + 0.1) + ')';
            cx.font = '8px sans-serif';
            cx.textAlign = 'center';
            cx.fillText('\u2194', p.x + p.w / 2, p.y + ph / 2 + 3);
        }

        // Top highlight
        cx.fillStyle = rome ? '#c09a78' : '#7a9ab8';
        cx.fillRect(p.x + 3, p.y + 1, p.w - 6, 3);

        // Label
        if (p.label) {
            cx.fillStyle = 'rgba(255,255,255,0.9)';
            cx.font = 'bold 9px "DM Sans",sans-serif';
            cx.textAlign = 'center';
            cx.fillText(p.label, p.x + p.w / 2, p.y - 7);
        }

        // Final platform glow
        if (p.final) {
            cx.save();
            cx.shadowColor = '#7eb8ff';
            cx.shadowBlur = 20;
            cx.strokeStyle = 'rgba(126,184,255,0.5)';
            cx.lineWidth = 2;
            rr(p.x - 2, p.y - 2, p.w + 4, ph + 4, 6);
            cx.stroke();
            cx.restore();

            // Bavarian flag on pole (goal)
            const fx = FLAG.x;
            const fy = p.y;
            // Pole
            cx.fillStyle = '#999';
            cx.fillRect(fx, fy - 48, 3, 48);
            // Pole top ball
            cx.fillStyle = '#ddb44a';
            cx.beginPath(); cx.arc(fx + 1, fy - 49, 3, 0, Math.PI * 2); cx.fill();
            // Flag cloth
            const wave = Math.sin(Date.now() / 200) * 1.5;
            const fW = 26, fH = 18;
            const ffx = fx + 3, ffy = fy - 48;
            // White background
            cx.fillStyle = '#ffffff';
            cx.fillRect(ffx, ffy + wave, fW, fH);
            // Bavarian blue & white diamond pattern
            cx.fillStyle = '#0078ba';
            const d = 4;
            for (let r = 0; r < Math.ceil(fH / d); r++) {
                for (let c = 0; c < Math.ceil(fW / d); c++) {
                    if ((r + c) % 2 === 0) {
                        const dx = ffx + c * d;
                        const dy = ffy + wave + r * d;
                        const dw = Math.min(d, ffx + fW - dx);
                        const dh = Math.min(d, ffy + wave + fH - dy);
                        if (dw > 0 && dh > 0) cx.fillRect(dx, dy, dw, dh);
                    }
                }
            }
            // Flag border
            cx.strokeStyle = 'rgba(0,0,0,0.2)';
            cx.lineWidth = 1;
            cx.strokeRect(ffx, ffy + wave, fW, fH);
            // Glow around flag
            cx.save();
            cx.shadowColor = '#0078ba';
            cx.shadowBlur = 12;
            cx.fillStyle = 'rgba(0,120,186,0.08)';
            cx.fillRect(ffx - 4, ffy + wave - 4, fW + 8, fH + 8);
            cx.restore();
        }
    }
    function lc(a, b, t) { return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }

    function gDrawBg() {
        // Sky Gradient (Rome Sunset -> Munich Day)
        const t = Math.min(1, Math.max(0, (cam.x - 200) / 2800));
        // Rome: Warm Sunset (Orange/Pink/Purple)
        const rTop = [255, 140, 100];
        const rBot = [100, 40, 80];
        // Munich: Alpine Day (Deep Blue/Cyan/White)
        const mTop = [0, 100, 180];
        const mBot = [200, 240, 255]; // slight mist at bottom

        const top = lc(rTop, mTop, t);
        const bot = lc(rBot, mBot, t);

        const g = cx.createLinearGradient(0, 0, 0, GH);
        g.addColorStop(0, 'rgb(' + top + ')');
        g.addColorStop(1, 'rgb(' + bot + ')');
        cx.fillStyle = g;
        cx.fillRect(0, 0, GW, GH);

        // Sun / Moon / Stars
        cx.save();
        if (t < 0.5) {
            // Rome Sun setting
            cx.fillStyle = 'rgba(255, 200, 50, ' + (1 - t * 2) + ')';
            cx.beginPath(); cx.arc(600 - cam.x * 0.05, 100 + t * 50, 40, 0, Math.PI * 2); cx.fill();
        } else {
            // Munich smooth daylight clouds (simulated via gradient)
        }
        cx.restore();

        // Parallax Layers
        // 1. Far Clouds (Slowest)
        drawParallaxLayer(0.05, [
            { x: 100, y: 50, w: 60, h: 30, type: 'cloud' },
            { x: 400, y: 80, w: 80, h: 35, type: 'cloud' },
            { x: 800, y: 40, w: 70, h: 30, type: 'cloud' }
        ], 0, 2000, 'rgba(255,255,255,0.4)');

        // 2. Far Mountains / Hills (Slow)
        // Rome: Rolling Hills (Warm Green/Brown) -> Munich: Alps (Grey/Blue/White)
        const hillsColor = lc([160, 100, 80], [100, 120, 140], t);
        drawMountains(0.1, 'rgb(' + hillsColor + ')', t);

        // 3. Mid-ground Cityscape (Faster)
        const cityColor = lc([100, 60, 50], [60, 70, 90], t); // Silhouette color
        drawCityLayer(0.2, 'rgb(' + cityColor + ')', t);

        // 4. Ground
        const groundColor = lc([80, 50, 40], [40, 50, 60], t);
        cx.fillStyle = 'rgb(' + groundColor + ')';
        cx.fillRect(0, GH - 20, GW, 20);
    }

    function drawParallaxLayer(speed, items, yOff, period, color) {
        const ox = cam.x * speed;
        cx.fillStyle = color;
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            let bx = (it.x - ox) % period;
            if (bx < -it.w) bx += period;
            if (bx > GW) continue;

            if (it.type === 'cloud') {
                // Simple fluff
                cx.beginPath();
                cx.arc(bx, it.y + yOff, it.h / 2, 0, Math.PI * 2);
                cx.arc(bx + it.w * 0.3, it.y - it.h * 0.2 + yOff, it.h * 0.6, 0, Math.PI * 2);
                cx.arc(bx + it.w * 0.6, it.y + yOff, it.h / 2, 0, Math.PI * 2);
                cx.fill();
            }
        }
    }

    function drawMountains(speed, color, t) {
        const ox = cam.x * speed;
        cx.fillStyle = color;
        cx.beginPath();
        cx.moveTo(0, GH);

        // Generate pseudo-random terrain based on sine waves
        for (let x = 0; x <= GW; x += 10) {
            const wx = x + ox;
            // Rome: Smooth rolling hills (low freq, low amp)
            // Munich: Jagged peaks (high freq, high amp)
            const romeH = Math.sin(wx * 0.005) * 40 + Math.sin(wx * 0.01) * 20;
            const munichH = Math.abs(Math.sin(wx * 0.01 + 1)) * 80 + Math.abs(Math.sin(wx * 0.03)) * 30;

            const h = romeH * (1 - t) + munichH * t; // Blend
            const y = GH - 50 - h;
            cx.lineTo(x, y);
        }
        cx.lineTo(GW, GH);
        cx.closePath();
        cx.fill();
    }

    function drawCityLayer(speed, color, t) {
        const ox = cam.x * speed;
        cx.fillStyle = color;

        // Rome Landmarks - Colosseum
        // Position: 200 (parallax units) -> Starts at screen x=200
        const cxPos = 200 - ox;
        if (cxPos > -200 && cxPos < GW) {
            const coY = GH;
            const coCol = 'rgb(190,145,95)'; // Warm stone

            cx.fillStyle = coCol;
            rr(cxPos, GH - 80, 120, 60, 4); cx.fill(); // Main block

            // Arches knockout
            cx.fillStyle = 'rgba(60,40,30,0.4)'; // Darker
            for (let i = 0; i < 9; i++) {
                const ax = cxPos + 8 + i * 12;
                cx.fillRect(ax, GH - 20, 6, 12);
                cx.beginPath(); cx.arc(ax + 3, GH - 20, 3, Math.PI, 0); cx.fill();
            }
            // Upper arches
            for (let i = 0; i < 9; i++) {
                const ax = cxPos + 8 + i * 12;
                cx.fillRect(ax, GH - 45, 6, 12);
                cx.beginPath(); cx.arc(ax + 3, GH - 45, 3, Math.PI, 0); cx.fill();
            }

            cx.fillStyle = color; // Restore
        }

        // St Peter Dome
        const spPos = 500 - ox;
        if (spPos > -100 && spPos < GW) {
            cx.fillStyle = 'rgb(200,180,160)'; // Lighter stone
            cx.fillRect(spPos - 40, GH - 80, 80, 60);
            cx.beginPath(); cx.arc(spPos, GH - 80, 40, Math.PI, 0); cx.fill();
            cx.fillRect(spPos - 5, GH - 135, 10, 15); // cross/top
            cx.fillStyle = color; // Restore
        }

        // Munich Landmarks
        // Frauenkirche - Position adjusted for parallax range ~800-1000
        const fkPos = 850 - ox;
        if (fkPos > -100 && fkPos < GW) {
            const brick = 'rgb(160,80,60)'; // Red brick
            const dome = 'rgb(60,100,80)'; // Copper dome

            cx.fillStyle = brick;
            cx.fillRect(fkPos - 30, GH - 110, 25, 90);
            cx.fillRect(fkPos + 5, GH - 110, 25, 90);

            // Onion domes
            cx.fillStyle = dome;
            cx.beginPath(); cx.arc(fkPos - 17.5, GH - 110, 12, Math.PI, 0); cx.fill();
            cx.beginPath(); cx.arc(fkPos + 17.5, GH - 110, 12, Math.PI, 0); cx.fill();

            cx.fillStyle = color; // Restore
        }
        // Olympiaturm
        const otPos = 980 - ox;
        if (otPos > -50 && otPos < GW) {
            cx.fillStyle = 'rgb(180,190,200)'; // Concrete/Grey
            cx.fillRect(otPos - 2, GH - 160, 4, 140);
            cx.beginPath(); cx.arc(otPos, GH - 130, 8, 0, Math.PI * 2); cx.fill();
            cx.beginPath(); cx.arc(otPos, GH - 115, 6, 0, Math.PI * 2); cx.fill();

            cx.fillStyle = color; // Restore
        }

        // Generic buildings filler
        const count = 30;
        for (let i = 0; i < count; i++) {
            const h = 30 + (i * 12345 % 70);
            const w = 20 + (i * 54321 % 40);

            // Distribute across strip [0, 1200] parallax space
            let bx = (i * 50) - ox;

            // Simple collision check with landmarks parallax positions
            // Rome: ~200, 500. Munich: ~850, 980.
            const pX = i * 50;
            const inRome = (pX > 150 && pX < 350) || (pX > 450 && pX < 600);
            const inMunich = (pX > 800 && pX < 920) || (pX > 940 && pX < 1020);

            if (inRome || inMunich) continue;

            if (bx > -w && bx < GW) {
                cx.fillRect(bx, GH - 20 - h, w, h);
                // Windows
                cx.fillStyle = 'rgba(255,255,200,0.3)';
                if (i % 3 === 0) {
                    for (let wy = 0; wy < h - 10; wy += 12) {
                        if ((wy + i) % 2 === 0) cx.fillRect(bx + 4, GH - 20 - h + wy + 4, w - 8, 4);
                    }
                }
                cx.fillStyle = color; // Restore
            }
        }
    }
}
