@echo off
REM 本地构建验证脚本
REM 用于验证项目可以在本地正确构建

echo.
echo ========================================
echo 🔍 Link Exchange SDK - 本地构建验证
echo ========================================
echo.

REM 检查 pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 pnpm
    echo   请安装: npm install -g pnpm
    pause
    exit /b 1
)

echo [1/6] 检查依赖...
if not exist "node_modules" (
    echo ⚠️  node_modules 不存在，需要先安装依赖
    echo.
    set /p continue="是否现在安装? (Y/N): "
    if /i "%continue%"=="Y" (
        echo 正在安装依赖...
        call pnpm install
        if %ERRORLEVEL% NEQ 0 (
            echo [错误] 依赖安装失败
            pause
            exit /b 1
        )
    ) else (
        echo 已取消
        pause
        exit /b 0
    )
)

echo.
echo [2/6] 清理旧的构建产物...
if exist "packages\core\dist" rmdir /s /q packages\core\dist
if exist "packages\react\dist" rmdir /s /q packages\react\dist
if exist "packages\script\dist" rmdir /s /q packages\script\dist
echo ✅ 清理完成

echo.
echo [3/6] 构建核心包 @link-exchange/core...
cd packages\core
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo [错误] Core 包构建失败
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo ✅ Core 包构建成功

echo.
echo [4/6] 构建所有包...
call pnpm -r --filter "@link-exchange/*" run build
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 包构建失败
    pause
    exit /b 1
)
echo ✅ 所有包构建成功

echo.
echo [5/6] 类型检查...
call pnpm -r exec tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 类型检查发现问题
    echo.
) else (
    echo ✅ 类型检查通过
)

echo.
echo [6/6] 运行测试...
call pnpm -r run test
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 测试失败
    echo.
) else (
    echo ✅ 测试通过
)

echo.
echo ========================================
echo 📊 构建验证结果
echo ========================================
echo.

echo 构建产物:
if exist "packages\core\dist\index.js" (
    echo   ✅ packages/core/dist/
) else (
    echo   ❌ packages/core/dist/ - 未找到
)

if exist "packages\react\dist\index.js" (
    echo   ✅ packages/react/dist/
) else (
    echo   ❌ packages/react/dist/ - 未找到
)

if exist "packages\script\dist\link-exchange.umd.cjs" (
    echo   ✅ packages/script/dist/
) else (
    echo   ❌ packages/script/dist/ - 未找到
)

echo.
echo ========================================
echo ✅ 本地构建验证完成！
echo ========================================
echo.
echo 下一步:
echo   1. 提交代码到 GitHub
echo   2. 查看 GitHub Actions CI 运行结果
echo.

pause
