# 🏗️ CI/CD Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT                                  │
│                                                                      │
│  Developer → Code Changes → Git Commit → Push to About-us Branch   │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GITHUB REPOSITORY                               │
│                                                                      │
│  Repository: misheck12/amenshi_4_life                               │
│  Branch: About-us (Production)                                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  .github/workflows/                                          │  │
│  │  ├── deploy.yml          (Main deployment)                   │  │
│  │  ├── deploy-rsync.yml    (Fast deployment)                   │  │
│  │  ├── pr-checks.yml       (Code quality)                      │  │
│  │  └── rollback.yml        (Emergency recovery)                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  GitHub Secrets (Encrypted)                                  │  │
│  │  ├── VM_HOST                                                 │  │
│  │  ├── VM_USERNAME                                             │  │
│  │  ├── VM_SSH_KEY                                              │  │
│  │  ├── VM_PROJECT_PATH                                         │  │
│  │  ├── API_URL                                                 │  │
│  │  └── FRONTEND_URL                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS RUNNER                             │
│                    (Ubuntu Latest - Cloud)                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  JOB 1: Build & Test                                         │  │
│  │  ┌────────────────┐         ┌────────────────┐              │  │
│  │  │  Client Build  │         │  Server Build  │              │  │
│  │  ├────────────────┤         ├────────────────┤              │  │
│  │  │ npm ci         │         │ npm ci         │              │  │
│  │  │ npm run lint   │         │ (validation)   │              │  │
│  │  │ npm run build  │         │                │              │  │
│  │  └────────────────┘         └────────────────┘              │  │
│  │         │                                                     │  │
│  │         ▼                                                     │  │
│  │  ┌─────────────────────────────────┐                        │  │
│  │  │  Upload Build Artifacts         │                        │  │
│  │  │  (client/dist)                  │                        │  │
│  │  └─────────────────────────────────┘                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  JOB 2: Deploy                                               │  │
│  │  ├── Download artifacts                                      │  │
│  │  ├── SSH to VM (using VM_SSH_KEY)                           │  │
│  │  └── Execute deployment script                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  JOB 3: Health Check                                         │  │
│  │  ├── Wait 10 seconds                                         │  │
│  │  ├── Check API health endpoint                              │  │
│  │  └── Check frontend accessibility                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             │ SSH Connection (Port 22)
                             │ Encrypted with SSH Key
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION VM SERVER                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  DEPLOYMENT PROCESS                                          │  │
│  │                                                              │  │
│  │  1. git pull origin About-us                                │  │
│  │     └─ Update code from GitHub                              │  │
│  │                                                              │  │
│  │  2. node migrations/migrate.js                              │  │
│  │     └─ Run database migrations                              │  │
│  │     └─ Track in MongoDB migrations collection               │  │
│  │                                                              │  │
│  │  3. cd server && npm ci --production                        │  │
│  │     └─ Install production dependencies                      │  │
│  │                                                              │  │
│  │  4. pm2 restart amenshi4life-server                         │  │
│  │     └─ Restart Node.js backend                              │  │
│  │                                                              │  │
│  │  5. cd ../client && npm ci && npm run build                 │  │
│  │     └─ Build React frontend                                 │  │
│  │                                                              │  │
│  │  6. sudo cp -r dist/* /var/www/amenshi4life/               │  │
│  │     └─ Deploy to web root                                   │  │
│  │                                                              │  │
│  │  7. sudo systemctl reload nginx                             │  │
│  │     └─ Reload web server                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  DIRECTORY STRUCTURE                                         │  │
│  │                                                              │  │
│  │  /home/ubuntu/amenshi_4_life/                               │  │
│  │  ├── client/                                                │  │
│  │  │   ├── src/                                               │  │
│  │  │   ├── dist/              (build output)                  │  │
│  │  │   └── package.json                                       │  │
│  │  │                                                           │  │
│  │  ├── server/                                                │  │
│  │  │   ├── config/                                            │  │
│  │  │   ├── controllers/                                       │  │
│  │  │   ├── models/                                            │  │
│  │  │   ├── routes/                                            │  │
│  │  │   ├── migrations/                                        │  │
│  │  │   │   ├── migrate.js    (migration runner)              │  │
│  │  │   │   └── scripts/      (migration files)               │  │
│  │  │   ├── .env              (environment variables)          │  │
│  │  │   ├── server.js                                          │  │
│  │  │   └── package.json                                       │  │
│  │  │                                                           │  │
│  │  └── .git/                                                  │  │
│  │                                                              │  │
│  │  /var/www/amenshi4life/    (nginx web root)                │  │
│  │  ├── index.html                                             │  │
│  │  ├── assets/                                                │  │
│  │  └── ...                                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  RUNNING SERVICES                                            │  │
│  │                                                              │  │
│  │  ┌─────────────────────┐      ┌─────────────────────┐      │  │
│  │  │  PM2 Process Mgr    │      │  Nginx Web Server   │      │  │
│  │  │                     │      │                     │      │  │
│  │  │  amenshi4life-      │      │  Port 80 → 443     │      │  │
│  │  │  server             │◄─────┤  (SSL redirect)     │      │  │
│  │  │                     │      │                     │      │  │
│  │  │  Port: 5000         │      │  Port 443 (HTTPS)  │      │  │
│  │  │  Auto-restart: Yes  │      │  ├─ / → static     │      │  │
│  │  │  Instances: 1       │      │  └─ /api → :5000   │      │  │
│  │  └─────────────────────┘      └─────────────────────┘      │  │
│  │                                                              │  │
│  │  ┌─────────────────────┐      ┌─────────────────────┐      │  │
│  │  │  MongoDB Database   │      │  Let's Encrypt SSL  │      │  │
│  │  │              astructure
e infr- ✅ Scalablitoring
 Health monnt
- ✅ess manageme- ✅ Procecurity
 s✅ SSL/HTTPSlity
-  capabi- ✅ Rollbackations
migrtabase  Das
- ✅ymentted deploma
- ✅ Autovides:**itecture proarch

**This -┘
```

--─────────────────────────────────────────────────────└────────     │
   er          ertbot.tim status cystemctlsudo s    └─     │
│                        rtificates rtbot ce ├─ sudo ce  
│  │                                       te   tifica6. SSL Cer
│  ────────┐───────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────│
└─────                         og d.lngodb/mongolog/mo└─ /var/         │
│            tics)     atis(database st) ts(─ db.sta    ├    │
│                  ll)        hease s(datab├─ mongosh   │
│                                                 oDB    Mong
│  5. ──────┐────────────────────────────────────────────────

┌──────────┘──────────────────────────────────────────────────────────
└ │                          etwork)  tulpn (netstat - n   └─ │
│                                     -h (memory)    ├─ free    │
│                              space)    sk f -h (di├─ d       │
│                                U, memory) p (CP hto ├─│            │
                           s      cesourSystem Re─┐
│  4. ────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────└────────     │
                      /error.log log/nginxvar/ └─ /   │
│                    .log        x/accessr/log/ngin     ├─ /va       │
│                                 ogs       Nginx L
│  3. ──┐──────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────── │
└─                ver        4life-serhow amenshi└─ pm2 s      │
│                                          onit  m     ├─ pm2│
│                      server   nshi4life- ame pm2 logs
│     ├─  │                                        tatus     ├─ pm2 s    │
│                          er         cess Manag2. PM2 Pro─┐
│  ─────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────ions  │
└─/acthi_4_lifeamens/misheck12/ub.comtps://gith  ht
│           │                 logshistory and deployment  View│
│     └─                                 boards DashAction 1. GitHub ──┐
│ ───────────────────────────────────────────────────────────

```
┌ Pointsoringnit--

## Mo`

-┘
``─────────────────────────────────────────────────────────────
└ │                                   itization  Input san
│  └─   │                     )         (bcryptngword hashiss
│  ├─ Pa        │             nly)   localhost og (ndinwork bi ├─ Net  │
│                                 henticationaut ├─ MongoDB       │
│                       ity      ase Securatab: DLayer 6───┐
│  ────────────────────────────────────────────────────────  ▼
┌──          
           │─┘
   ───────────────────────────────────────────────────┬───────      │
└──                              ntication  JWT authe│  └─    │
                 lidator)s-va (expresationnput valid │
│  ├─ I                 imit)    -rate-lressng (exp Rate limiti├─
│          │                            iguration  ├─ CORS conf│
│                   )   ity headers secur (Expresselmet.js├─ H │
│                           urity     tion Sec: Applica│  Layer 5───┐
─────────────────────────────────────────────────────────       ▼
┌─
          │    ────┘
     ────────────────────────────────────────────────────┬─────  │
└                                 version   ver Hide ser│  └─     │
                           mits      size liRequest
│  ├─          │                     l)  ptiona limiting (o─ Rate│
│  ├           )     tc.-Options, e-Frameeaders (Xity h│  ├─ Secur       │
                          ty    inx SecuriLayer 4: Ng  ───┐
│─────────────────────────────────────────────────────   ▼
┌─────                │
 ──┘
      ──────────────────────────────────────────┬─────────────────
└      │                   validity)  (90-day alrenew └─ Auto-     │
│                           es     er suitphng ci
│  ├─ Stro │                                  y    onl.3 / 1 1.2│  ├─ TLS  │
                         ificate    ncrypt cert's E Let │
│  ├─                                Encryption: SSL/TLS 
│  Layer 3──────┐───────────────────────────────────────────────────  ▼
┌────        
    │           ──────┘
 ───────────────────────────────────────────────────┬─     │
└───        SH key       Sryptednctions uses eub Ac └─ GitH   │
│                            enticationd authassworNo p │
│  ├─                           lyion oncatuthentiKey-based a │
│  ├─                          tion       entica 2: SSH Auth
│  Layer─┐─────────────────────────────────────────────────┌───────────     ▼
              │
    ─┘
   ───────────────────────────────────────────────┬─────│
└────────                              r ports     ll othe└─ Deny: A  │
│                             HTTPS)     (: Port 443  ├─ Allow│
│        S)     s to HTTPredirect (HTTP → w: Port 80llo ├─ A  │
│                          SH)         (S: Port 22  ├─ Allow
│     │                                    FirewallUFW│  Layer 1: ─┐
────────────────────────────────────────────────────────▼
┌────            
   │         ──────┘
  ─────────────────────────────────────────────┬─────────
└─          │                                L THREATS  RNA│  EXTE─────────┐
───────────────────────────────────────────────
```
┌─────tecture
rity Archi Secu
---

##red
```
ion requitervent─> Manual in  └            e ❌
  ailur     └─ F
               │    mplete
   Coollback   │  └─> R        uccess ✅
    ├─ S          │
          ─────┘
    ───────────────────────────────────────────────────┬─   │
└────                                  nd: /    Fronte
│  - Check   │                             h         PI: /healt  - Check A   │
│                                           lth Checks   Hea
│───────────┐───────────────────────────────────────────────  ▼
┌───           │
             ┘
─────────────────────────────────────────────────────┬──────  │
└──                          d nginx      reloatlo systemc   │
│  sud                                      Nginx       
│  Reload ─────────┐─────────────────────────────────────────────▼
┌───────               │
    ──┘
       ────────────────────────────────────────────────────┬───
└────          │         enshi4life/w/amt/* /var/ww disudo cp -r s│
│                                                ntCliey lo Dep
│ ──┐─────────────────────────────────────────────────────────── ▼
┌                │
  
       ─────┘────────────────────────────────────────────┬─────
└───────        │           ld  buin  rui && npmpm c/client && n
│  cd .. │                                         Client     
│  Rebuild──┐──────────────────────────────────────────────────── ▼
┌───────                  │
    
   ─────┘─────────────────────────────────────────┬──────────────
└─       │                  er    ervfe-slii4shtart amen│  pm2 res      │
                                r        rt Servesta│  Re───────┐
───────────────────────────────────────────────────▼
┌───          │
             ──┘
   ─────────────────────────────────────────────────────┬─────│
└─                   n         ctio--produpm ci  && nd server │
│  c                                  ndencies   stall DepeRein
│  ┐──────────────────────────────────────────────────────┌───────▼
     
                │────┘
     ──────────────────────────────────────────────┬───────── │
└──                             t-commit>  t <targeckou  git che────┐
│────────────────────────────────────────────────────────   ▼
┌─          
        │─┘
     ─────────────────────────────────────────────────────┬──────       │
└─            it (HEAD~1)vious comm prepty: Use│  - If em       │
                   that      ed: Use A provid  - If SH     │
│                       it:         Commine Target  Determ
│─────┐───────────────────────────────────────────────
┌─────────    ▼│
                   ─────┘
   ─────────────────────────────────────────┬─────────────      │
└──                       file)ck_backup to .rollba
│  (Save │                                t SHA  Commit  Curren
│  Backup─────┐─────────────────────────────────────────────────
┌───────  ▼          
   │
           ┘───────────────────────────────────────────┬────────────────└──       │
                                    o VM        SH t
│  S─┐───────────────────────────────────────────────────────────▼
┌─            │
            ─────┘
  ──────────────────────────────────────────┬─────────
└─────           │                  BACK"LL "ROpedUser ty: idate  Val────────┐
│───────────────────────────────────────────────────┌──   ▼

                 │   
   ────────┘─────────────────────────────────┬───────────────
└─────│                    t)  oymen Depl Rollback Actions →Hubit  │
│  (G                           owrkflWors Rollback Triggeser ───┐
│  U───────────────────────────────────────────────────────┌───ow

```
ack Fl Rollb---

##─┘
```

──────────────────────────────────└───
           │ent      ploymue with de│  Contin    
      │      ✅ons CompletetiMigra    │  All ───────┐
 ───────────────────────────────
     ┌ ▼                  │
                   ───────┘
  ─────────────────────┬──────     └───  │
     t ❌ eploymenr: Stop df erro  I   │      │
                               │       │
                     g success  4. Lo│   │
     ection tions colln migrad i  3. Recor  │   e)   │
n.up(mongoostiomigrate 2. Execu    │     │
          le  gration fi Load mi  1.   │
     │                                  │               │
ration:Pending Mig│  For Each     ──┐
 ──────────────────────────────────    ┌──  ▼
                     │
        ions
  grat pending mi└─ Has                │
         eployment
  continue dp,  │  └─> Ski       ns
    migratio pending     ├─ No       
            │   ──────┘
───────────────────────────────────┬────────────
└────────        │         - Applied  All s =g Migrationr: Pendin Filte───┐
│ ──────────────────────────────────────────────────▼
┌────────       │
                ─────┘
   ───────────────────────────────────┬──────────────────── │
└─              tions)     migrad y appliealreadof Get list 
│  (           │           ection ions' Coll 'migratoDBy Mong┐
│  Quer─────────────────────────────────────────────────────────────  ▼
┌     │
                   ───┘
─────────────────────────────────────────────────────┬
└─────     │                        ly)        alphabeticed alSort   │
│  (  scripts/    s/grationrver/mies from sen Filatio  Get Migr────┐
│───────────────────────────────────────────────┌──────────     ▼

                 │   ─┘
 ──────────────────────────────────────────────┬───────└─────── │
                                  DB       t to Mongonnec
│  Co─────────┐────────────────────────────────────────────────────      ▼
┌  │
              ┘
    ────────────────────────────────────────────┬─────────────────     │
└                        .jsrates/migation: node migrun────┐
│  R──────────────────────────────────────────────────────
┌───  ▼                  │
─┘
      ───────────────────────────────────────────────────────┬───   │
└──                                     VM   to Code Pulled ─────┐
│  ────────────────────────────────────────────────────────      ▼
┌     │
            ┘
   ────────────────────────────────────────────┬────────────  │
└─────                                 ggered     loyment Tri─┐
│  Dep─────────────────────────────────────────────────────────

```
┌───lowon F Migrati--

##─┘
```

-──────────────────────────────    └──                          │
                       ...       │  └─              
                    │s        ation│  ├─ migr                          │
                         ers us     │  ├─                        │
                  ects   roj├─ p│                                        │
          ns:lectioCol│                         
               │                       │                          │
          se         abaat DngoDB Mo   │                           ───┐
────────────────────────   ┌──────                                ▼
                                   
  osego   │ Mon                                  │
                                             ─┘
    ────────────────┼──────────       └────                  
    ──┘  │───────────────┬────────  │  └                          │
      │                │  Models    │                        
  ──┐  │─────────────────────│  ┌───                              │
           ▼                 │                        │
                            │            │                           ─┘  │
  ─────────────────┬───└────  │                         │  │
               ollers  ntrCo  │  │                        
     ───┐  │─────────────────────── │  ┌                                 │
            ▼                         │                      │
                       │       │                     │
       ────────┘  ───┬────────────  └── │                   
             │  │th         │  └─ /heal        │                 
             │  │t api/contac  │  │  ├─ /────┘    ───────────────── │  │
└          i/auth│  ├─ /ap  │      │       ages    Im- │
│    │      /projects   │  ├─ /api  │  │       S          - CS    │  │
│                │  Routes│    │      ript    
│  - JavaSc──┐  │──────────────────────── ┌  │      │      htmldex. in     │
│  -                                │s)     │  ile(Static F
│           │  Server (PM2)│  Express              │   React SPA ┐
│ ───────────────────────── ┌──────────────┐     ──────────
┌─────  ▼                   ▼              
        │                                   │  000
    st:5  │ localho4life/     ww/amenshi    │ /var/wo
        roxy t │ P            om      e fr      │ Serv             │
                                │──────┘
   ──────────┼────────────────────────────┼────────────
└───┘         │──┬─────────────     └──   ───────┘ ──────┬── └──
│     │   │     ds/*    /uploa     │    │       ssets/* │
│  │  /a            │      *     │  /api/     │             │  /      │
│            │  ProxyAPI    │        │  ic Files  
│  │  Stat │───┐        ──────────────  ┌─      ───────┐ ┌───────────│        │
                                                    │
│                        y)  ProxINX (Reverse NG                ─┐
│   ────────────────────────────────────────────────────────
┌────        ▼    t 443)
 or      │ (P
       equest R │ HTTPS           
          │──┘
    ──────────────────────────────────────────────┬──────────      │
└──                    er)Brows   CLIENT (           ─┐
│      ───────────────────────────────────────────────────────────

```
┌─w Diagram Data Flo---

##tes**

inu: ~3-5 mation**Total Dur``

| All
`        mplete       co✅ Deployment| er
00:18   RunntHub       | Gi  ontend      check: Fr Health   |
00:17 b RunnertHu  | Gi            ck: API     Health che00:16   |     | VM
                ded  eloa  | Nginx r00:15 | VM
            ooted to web r Files copi  |00:14 VM
         |       lt on VM   ent bui| CliM
00:13         | V        server    estarts r:12   | PM2  | VM
00lled     instaencies  dependServer   | 11
00:BVM + MongoD       | n      grations ruatabase mi00:10   | D | VM
  b          Huled from Git Code pul:09   |
00GitHub → VM          | ishedbltation esH connec08   | SS00:r
tHub Runne Gi           |       uploaded ifacts| Art07   Runner
00:GitHub          | kedencies checr dependServe06   | nner
00:tHub Ru      | Gie         ompletld client bui   | C
00:05nsGitHub Actio       |         d   low triggere   | Workf
00:02ub   | GitH            cts push  itHub dete| G01   0:achine
0cal MLo    |   out-us  pushes to Abeloper 0:00   | Dev--
0------------|-----------------------------------------
--------|mponent Co           |           ion        ime    | Act

```
T TimelineDeployment# 

#--

-``────────┘
`─────────────────────────────────────────────────────────
└──── │─────┘ ───────────────────────────────────────────────────────
│  └──  │          │            to user     ck onse sent baResp │     8. │
│        │                                                │        ↓ │  │
│                            (if needed) goDB query . Mon 7    │  │  │
  │                                                        ↓  │
│  │     │                equest   sses rserver procexpress . E
│  │     6  │  │                                        ↓                 │
│  │          │      PM2)        00 (localhost:50lls → I ca    └─ AP │
│  │        │     life/    shi4enww/am/w → /varStatic files   ├─ 
│  │         │  │                       uest:     s reqinx route│  │  5. Ng│  │
                                                        ↓       │ │  │
│         ert)       crypt cke (Let's EnS handsha SSL/TL
│  │  4.     │  │                                             ↓        
│  │     │  │                     3)ort 44s request (Px receiveNgin  3.  │  │  │
│                                                        ↓    │  │
│  │                              IP     ves to VM resol  │  2. DNS  │  │
│                                                    ↓        │  │
│  │                   hi4life.com ens://amtpshtts er visiUs│  │  1.    │  │
                                                         │  │      │  │
                                    low   quest F│  User Re─┐  │
│  ────────────────────────────────────────────────────────────    │
│  ┌─                                                                  
││                            ife.com  hi4l//amenser → https:│  🌐 Brows
  │                                                                 │
│                               SERS           END U             
│         ─────────┐──────────────────────────────────────────────────────────
┌──           ▼                    │
                      ───┘
     ──────────────────────────────────┬───────────────────────────────
└─────┘  │─────────────────────────────────────────────────────────│  │
│  └─                        rs         curity HeadeSe└── Nginx   │  │  │
│                  pt)   (Let's Encryn EncryptioSL/TLS ├── S │      │  │
│           s)    asswordation (no pAuthenticy ├── SSH Ke│
│  │   │                                 HTTPS)     (ort 443│   └─ P  │  │   │  │
                               P)     80 (HTT ├─ Port│    │
│  │           │                              t 22 (SSH)or  ├─ P │ │ 
│         │  │                   ed)        (enablwall UFW Fire│  ├──  │  │
│                                                    │  SECURITY│  ─────┐  │
─────────────────────────────────────────────────────────│
│  ┌                                                                  │
│     ───┘ ───────────────────────────────────────────────────────
│  └──── │  │    ──────┘ ──────────────└───┘      ──────────────────  └─ │ │  │
│ │                      │       │               └─ ...  │
│  │  │  │      │                          │ ns      │ tiora  │  ├─ mig│  │
│  │  s     │    : 90 dayidVal  │      │          sers  ├─ u  │ │
│  │    │  fe.com   │   amenshi4li      │        │├─ projects  │  │      │  │
│       │  te: tifica  Cer     │       │ ions:ect │  Coll│  │ │
  │               │           │  │               │               │
│  │   │      │ce daily Runs twi    │       │  menshi4life │  a│
│  │    │     mer      │ bot tiCert      │    │    atabase:    │  │  │  D     │  │
  │ newal      │  Auto-re     │       ort: 27017   │  P │  │
│      │         │              │      │      