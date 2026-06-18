@echo off
setlocal

REM ============================================================
REM  One-click pnpm link for local deps (data-driven, self-contained).
REM  Equivalent to link.sh. The dependency-graph analysis is an
REM  inlined `node -e` snippet (no external .cjs helper).
REM
REM  Usage:
REM    link.bat                  build all links
REM    set "LINK_SCOPE=@some/" ^& link.bat   (scope, default @syvobase/)
REM    link.bat --unlink         remove links (best-effort)
REM
REM  NOTE: keep this file pure ASCII and run WITHOUT delayed expansion,
REM  otherwise the inlined JS (`!` chars) would be mangled by cmd.
REM ============================================================

REM ---- locate repo root (this script lives in <root>\scripts) ----
set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "ROOT=%%~fI"
set "SCOPE=@syvobase/"
if defined LINK_SCOPE set "SCOPE=%LINK_SCOPE%"
set "SYVO_ROOT=%ROOT%"
set "SYVO_SCOPE=%SCOPE%"

REM ---- parse args ----
set "UNLINK=0"
if /i "%~1"=="--unlink" set "UNLINK=1"

REM ---- dependency check ----
where node >nul 2>nul
if errorlevel 1 ( echo [x] node not found & exit /b 1 )
where pnpm >nul 2>nul
if errorlevel 1 ( echo [x] pnpm not found & exit /b 1 )

REM ---- run analysis into a temp plan file ----
REM     inlined JS (single quotes only, no " and no % so it survives cmd)
set "PLAN_FILE=%TEMP%\syvobase_link_plan_%RANDOM%_%RANDOM%.txt"
node -e "const fs=require('fs'),path=require('path');const root=process.env.SYVO_ROOT,scope=process.env.SYVO_SCOPE||'@syvobase/';const isDir=function(d){try{return fs.statSync(path.join(root,d)).isDirectory()}catch(e){return false}};const rp=function(d){try{return JSON.parse(fs.readFileSync(path.join(root,d,'package.json'),'utf8'))}catch(e){return null}};const dirs=fs.readdirSync(root).filter(function(d){return !d.startsWith('.')&&d!=='node_modules'&&isDir(d)});const by={};for(const d of dirs){const p=rp(d);if(p&&typeof p.name==='string'&&p.name.startsWith(scope))by[p.name]=d}for(const d of dirs){const p=rp(d);if(!p)continue;const s=new Set();for(const f of['dependencies','devDependencies','peerDependencies']){const o=p[f];if(!o)continue;for(const k of Object.keys(o))if(k.startsWith(scope))s.add(k)}for(const n of s){const dd=by[n];if(!dd){console.log('WARN|'+d+'|'+n);continue}if(dd===d)continue;console.log('LINK|'+d+'|'+n+'|'+dd)}}" > "%PLAN_FILE%"
if errorlevel 1 (
  echo [x] dependency-graph analysis failed
  if exist "%PLAN_FILE%" del "%PLAN_FILE%" >nul 2>nul
  exit /b 1
)

REM ---- Pass 1: overview ----
set "PLAN_LINK=0"
set "PLAN_WARN=0"
echo.
echo == dependency graph (scope %SCOPE%) ==
for /f "usebackq tokens=1,2,3,4 delims=|" %%a in ("%PLAN_FILE%") do (
  if "%%a"=="LINK" ( echo    %%b  --  %%c  --  %%d & set /a PLAN_LINK+=1 )
  if "%%a"=="WARN" ( echo    [!] %%b declares %%c but no local package found - skipped & set /a PLAN_WARN+=1 )
)
if %PLAN_LINK%==0 if %PLAN_WARN%==0 (
  echo [!] no %SCOPE% dependency found. exit.
  del "%PLAN_FILE%" >nul 2>nul
  exit /b 0
)

REM ---- Pass 2: execute ----
echo.
if "%UNLINK%"=="1" ( echo == removing local links, best effort == ) else ( echo == building local pnpm links == )
set "SUCC=0"
set "FAIL=0"
for /f "usebackq tokens=1,2,3,4 delims=|" %%a in ("%PLAN_FILE%") do (
  if "%%a"=="LINK" call :do_link "%%b" "%%c" "%%d"
)

REM ---- summary ----
echo.
echo == done ==
if "%UNLINK%"=="1" ( echo [v] restored: %SUCC%  failed: %FAIL% ) else ( echo [v] linked: %SUCC%  failed: %FAIL% )
if exist "%PLAN_FILE%" del "%PLAN_FILE%" >nul 2>nul
if not "%FAIL%"=="0" exit /b 1
exit /b 0

REM ============================================================
REM  subroutine: process one link
REM    %1=consumer  %2=depName  %3=depDir
REM ============================================================
:do_link
set "consumer=%~1"
set "depName=%~2"
set "depDir=%~3"
if not exist "%ROOT%\%consumer%\package.json" ( echo [!] skip %consumer% -- %depName% : consumer has no package.json & goto :eof )
if not exist "%ROOT%\%depDir%\package.json" ( echo [x] skip %consumer% -- %depName% : dep %depDir% has no package.json & goto :eof )

if "%UNLINK%"=="1" goto :unlink_branch
goto :link_branch

:unlink_branch
if defined DONE_%consumer% goto :eof
echo [*] unlink  %consumer%  via pnpm install
pushd "%ROOT%\%consumer%"
call pnpm install >nul 2>nul
if errorlevel 1 ( popd & goto :unlink_fail )
popd
echo [v] tried to restore %consumer%
set /a SUCC+=1
set "DONE_%consumer%=1"
goto :eof
:unlink_fail
echo [x] restore %consumer% failed - internal package may be unpublished, remove the symlink manually
set /a FAIL+=1
set "DONE_%consumer%=1"
goto :eof

:link_branch
echo [*] link  %consumer%  depends on  %depName%  --  %depDir%
if not defined DONE_%consumer% (
  pushd "%ROOT%\%consumer%"
  call pnpm install >nul 2>nul
  popd
  set "DONE_%consumer%=1"
)
pushd "%ROOT%\%consumer%"
call pnpm link "%ROOT%\%depDir%" >nul 2>nul
popd
REM pnpm may exit non-zero due to ERR_PNPM_IGNORED_BUILDS, so verify via filesystem
set "SYVO_NM=%ROOT%\%consumer%\node_modules\%depName%"
set "SYVO_DEP=%ROOT%\%depDir%"
node -e "const fs=require('fs');let ok=false;try{ok=fs.realpathSync(process.env.SYVO_NM)===fs.realpathSync(process.env.SYVO_DEP)}catch(e){}process.exit(ok?0:1)" >nul 2>nul
if errorlevel 1 goto :link_fail
echo [v] %consumer%  --  %depName%
set /a SUCC+=1
goto :eof
:link_fail
echo [x] link failed: %consumer% -- %depName%
set /a FAIL+=1
goto :eof
