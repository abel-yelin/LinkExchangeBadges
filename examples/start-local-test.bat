@echo off
REM Link Exchange SDK - 本地可视化测试启动脚本
REM 使用方法: 双击运行或在 PowerShell 中执行

echo.
echo ========================================
echo 🚀 Link Exchange SDK - 本地测试启动
echo ========================================
echo.

REM 检查 pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 pnpm，请先安装:
    echo   npm install -g pnpm
    pause
    exit /b 1
)

echo [1/4] 启动本地测试服务器 (端口 8080)...
echo.
start "LinkExchange-TestServer" cmd /k "cd /d H:\Web\LinkExchangeBadges && echo 正在启动测试服务器... && node examples/server.mjs"

timeout /t 2 /nobreak >nul

echo [2/4] 等待测试服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo [3/4] 测试配置文件...
echo 访问: http://localhost:8080/test-badges.json
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/test-badges.json' -TimeoutSec 2; Write-Host '✅ 测试服务器运行正常' -ForegroundColor Green } catch { Write-Host '⚠️  测试服务器未就绪，请稍候' -ForegroundColor Yellow }"

echo.
echo [4/4] 启动选项:
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  选择要启动的示例:                                           │
echo │                                                            │
echo │  [1] React Vite 示例 (http://localhost:5173)               │
echo │  [2] Next.js 示例 (http://localhost:3000)                   │
echo │  [3] 打开 HTML 示例 (浏览器)                               │
echo │  [4] 仅启动测试服务器                                      │
echo │  [0] 退出                                                 │
echo └────────────────────────────────────────────────────────────┘
echo.

set /p choice="请输入选项 (0-4): "

if "%choice%"=="1" (
    echo.
    echo 正在启动 React Vite 示例...
    cd H:\Web\LinkExchangeBadges\examples\react-vite
    if not exist "node_modules" (
        echo 首次运行，安装依赖...
        call pnpm install
    )
    start "LinkExchange-ReactVite" cmd /k "cd /d H:\Web\LinkExchangeBadges\examples\react-vite && pnpm dev"
    echo ✅ React Vite 示例已启动
    echo    访问: http://localhost:5173
)

if "%choice%"=="2" (
    echo.
    echo 正在启动 Next.js 示例...
    cd H:\Web\LinkExchangeBadges\examples\nextjs
    if not exist "node_modules" (
        echo 首次运行，安装依赖...
        call pnpm install
    )
    if not exist ".env.local" (
        echo 创建 .env.local 文件...
        echo NEXT_PUBLIC_BADGES_SOURCE=http://localhost:8080/test-badges.json > .env.local
    )
    start "LinkExchange-Nextjs" cmd /k "cd /d H:\Web\LinkExchangeBadges\examples\nextjs && pnpm dev"
    echo ✅ Next.js 示例已启动
    echo    访问: http://localhost:3000
)

if "%choice%"=="3" (
    echo.
    echo 正在打开 HTML 示例...
    start H:\Web\LinkExchangeBadges\examples\html\index.html
    echo ✅ HTML 示例已在浏览器中打开
)

if "%choice%"=="4" (
    echo.
    echo ✅ 测试服务器已在单独窗口中运行
    echo    配置地址: http://localhost:8080/test-badges.json
)

if "%choice%"=="0" (
    echo.
    echo 退出...
    exit /b 0
)

echo.
echo ========================================
echo 💡 提示:
echo   - 查看测试服务器窗口确认运行状态
echo   - 打开浏览器控制台查看埋点事件
echo   - 按 Ctrl+C 停止服务器
echo ========================================
echo.

pause
