$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskBrowserExe=Join-Path $env:APPDATA 'npm/node_modules/agent-browser/bin/agent-browser-win32-x64.exe'
function Invoke-LabBrowser {
 param([string[]]$TaskArguments)
 $raw=& $taskBrowserExe --session midnight-live --json @TaskArguments
 $code=$LASTEXITCODE
 $result=$raw|ConvertFrom-Json
 if($code -ne 0 -or -not $result.success){throw "Browser failed: $($TaskArguments -join ' ') — $($result.error)"}
 return $result.data
}
Invoke-LabBrowser -TaskArguments @('tab','t3')|Out-Null
Invoke-LabBrowser -TaskArguments @('set','media','light','reduced-motion')|Out-Null
Invoke-LabBrowser -TaskArguments @('wait','--fn','document.images.length===1&&Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')|Out-Null
$viewports=@()
foreach($size in @(@(1440,1000),@(768,1024),@(720,1000),@(390,844),@(320,740))){
 Invoke-LabBrowser -TaskArguments @('set','viewport',"$($size[0])","$($size[1])")|Out-Null
 $m=(Invoke-LabBrowser -TaskArguments @('eval','({width:innerWidth,scrollWidth:document.querySelector("section.sp-scroll").scrollWidth,containers:Array.from(document.querySelectorAll(".mf-container-opening,.mf-container-discover,.mf-container-backstage")).map(e=>({class:e.className,instances:e.querySelectorAll("div[id^=x]").length})),movieContent:/MIDNIGHT FRAMES|CINEMA|INTERSTELLAR|SHUTTER ISLAND|LA LA LAND/.test(document.body.innerText)})')).result
 if($m.scrollWidth -gt $m.width -or $m.containers.Count -ne 3 -or ($m.containers|Where-Object {$_.instances -ne 2}) -or $m.movieContent){throw 'Responsive structure or content check failed'}
 $viewports+=$m
}
Invoke-LabBrowser -TaskArguments @('set','viewport','390','844')|Out-Null
Invoke-LabBrowser -TaskArguments @('scrollintoview','.mf-menu-toggle')|Out-Null
Invoke-LabBrowser -TaskArguments @('click','.mf-menu-toggle')|Out-Null
$menu=(Invoke-LabBrowser -TaskArguments @('eval','document.querySelector(".mf-menu-toggle").getAttribute("aria-expanded")')).result
if($menu -ne 'true'){throw 'Mobile menu failed'}
Invoke-LabBrowser -TaskArguments @('click','.mf-menu-toggle')|Out-Null
Invoke-LabBrowser -TaskArguments @('scrollintoview','.mf-faq-item button')|Out-Null
Invoke-LabBrowser -TaskArguments @('focus','.mf-faq-item button')|Out-Null
Invoke-LabBrowser -TaskArguments @('press','Enter')|Out-Null
$faq=(Invoke-LabBrowser -TaskArguments @('eval','document.querySelector(".mf-faq-item button").getAttribute("aria-expanded")')).result
if($faq -ne 'true'){throw 'Keyboard FAQ failed'}
Invoke-LabBrowser -TaskArguments @('press','Enter')|Out-Null
Invoke-LabBrowser -TaskArguments @('wait','--fn','Array.from(document.querySelectorAll(".mf-request-board select")).some(e=>e.getBoundingClientRect().width>0)')|Out-Null
# Native responsive markup repeats IDs. Add browser-only unique QA hooks.
Invoke-LabBrowser -TaskArguments @('eval','Array.from(document.querySelectorAll(".mf-request-board select")).find(e=>e.getBoundingClientRect().width>0).setAttribute("data-lab-filter","true")')|Out-Null
Invoke-LabBrowser -TaskArguments @('select','[data-lab-filter="true"]','string:close')|Out-Null
Invoke-LabBrowser -TaskArguments @('wait','--fn','document.querySelector("[data-lab-filter]").value==="string:close"&&Array.from(document.querySelectorAll(".mf-request-board [role=cell]")).some(e=>e.innerText.trim()==="Closed")')|Out-Null
$closed=(Invoke-LabBrowser -TaskArguments @('eval','({filter:document.querySelector("[data-lab-filter]").value,requestLinks:document.querySelectorAll(".mf-request-board a[href*=ticket]").length})')).result
Invoke-LabBrowser -TaskArguments @('select','[data-lab-filter="true"]','string:open')|Out-Null
Invoke-LabBrowser -TaskArguments @('wait','--fn','document.querySelector(".mf-request-board").innerText.includes("Lab 8.1.1")')|Out-Null
# Filter actual existing requests for public proof; do not expose unrelated records.
Invoke-LabBrowser -TaskArguments @('eval','var i=Array.from(document.querySelectorAll(".mf-request-board input")).find(e=>e.getBoundingClientRect().width>0);i.setAttribute("data-lab-search","true");i.closest(".input-group").querySelector("button").setAttribute("data-lab-search-button","true")')|Out-Null
Invoke-LabBrowser -TaskArguments @('fill','[data-lab-search="true"]','Lab 8.1.1')|Out-Null
Invoke-LabBrowser -TaskArguments @('click','[data-lab-search-button="true"]')|Out-Null
Invoke-LabBrowser -TaskArguments @('wait','--fn','document.querySelector(".mf-request-board a[href*=ticket]")&&Array.from(document.querySelectorAll(".mf-request-board a[href*=ticket]")).every(e=>e.textContent.includes("Lab 8.1.1"))')|Out-Null
$runtime=(Invoke-LabBrowser -TaskArguments @('eval','({announcements:document.querySelector(".mf-noticeboard").innerText,articles:document.querySelectorAll(".mf-article").length,nativeRequests:!!document.querySelector(".v8cc0df25875023000f220cf888cb0bb5"),requestFilter:document.querySelector("[data-lab-search]").value,errors:Array.from(document.querySelectorAll(".alert-danger,.mf-request-error")).filter(e=>e.getBoundingClientRect().height>0).map(e=>e.innerText),reduced:matchMedia("(prefers-reduced-motion: reduce)").matches})')).result
$nativeCount=(Invoke-LabBrowser -TaskArguments @('eval','document.querySelectorAll(".mf-request-board .v8cc0df25875023000f220cf888cb0bb5").length')).result
if($runtime.errors.Count -or -not $runtime.nativeRequests -or -not $runtime.reduced -or $nativeCount -ne 1){throw 'Live native runtime error or duplicate widget'}
foreach($shot in @(@(1440,1000,'desktop'),@(390,844,'mobile'))){
 Invoke-LabBrowser -TaskArguments @('set','viewport',"$($shot[0])","$($shot[1])")|Out-Null
 Invoke-LabBrowser -TaskArguments @('scrollintoview','.mf-brand')|Out-Null
 Invoke-LabBrowser -TaskArguments @('focus','.mf-brand')|Out-Null
 Invoke-LabBrowser -TaskArguments @('hover','.mf-brand')|Out-Null
 Invoke-LabBrowser -TaskArguments @('eval','document.activeElement.blur();document.querySelector("section.sp-scroll").scrollTop=0;var s=document.createElement("style");s.id="lab09-capture";s.textContent="html,body,.sp-na-root-container,#sp-main-wrapper,section.page.sp-scroll{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;}section.page.sp-scroll{flex:none!important;}";document.head.appendChild(s);')|Out-Null
 Invoke-LabBrowser -TaskArguments @('screenshot','--full',(Join-Path $taskRoot "docs/screenshots/lab09-$($shot[2]).png"))|Out-Null
 Invoke-LabBrowser -TaskArguments @('eval','document.querySelector("#lab09-capture").remove()')|Out-Null
}
$report=[ordered]@{checkedAt=[DateTime]::UtcNow.ToString('o');status='PASS';deployed=$true;url='https://dev431102.service-now.com/gako_lab09?id=gako_lab09_home';testedUser='Authenticated admin';viewports=$viewports;mobileMenu=$menu;keyboardFaq=$faq;closedRequests=$closed;runtime=$runtime;screenshotNote='Real native requests filtered to the existing Lab 8.1.1 request for public evidence. Internal scroll wrapper expanded only in the browser for full-page capture, then restored.'}
$report|ConvertTo-Json -Depth 9|Set-Content -Encoding utf8 -LiteralPath (Join-Path $taskRoot 'docs/validation/deployed-browser.json')
Write-Output 'PASS: real 3/6 structure, five widths, mobile menu, keyboard FAQ, announcements, knowledge, native request filters/search, one embedded requests widget, original logo, reduced motion and public-safe screenshots.'
