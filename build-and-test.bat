@echo off
REM Link Exchange SDK - 构建和测试脚本

echo ========================================
echo Link Exchange SDK - 构建和测试
echo ========================================
echo.

REM 检查 pnpm 是否安装
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到 pnpm，请先安装 pnpm:
    echo   npm install -g pnpm
    exit /b 1
)

echo [1/5] 检查 Node.js 版本...
node --version

echo.
echo [2/5] 安装依赖...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 依赖安装失败
    exit /b 1
)

echo.
echo [3/5] 类型检查...
call pnpm typecheck
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 类型检查发现问题
)

echo.
echo [4/5] 构建所有包...
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 构建失败
    exit /b 1
)

echo.
echo [5/5] 运行测试...
call pnpm test
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 测试发现问题
)

echo.
echo ========================================
echo 构建完成！
echo ========================================
echo.
echo 构建产物位置:
echo   - packages/core/dist/
echo   - packages/react/dist/
echo   - packages/script/dist/
echo.
echo 运行示例:
echo   cd examples\react-vite && pnpm dev
echo   cd examples\nextjs && pnpm dev
echo.
