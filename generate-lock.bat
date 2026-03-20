@echo off
REM 生成 pnpm-lock.yaml 文件
REM 这个 lock 文件是 GitHub Actions CI 所需的

echo ========================================
echo 生成 pnpm-lock.yaml 文件
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

echo [1/3] 清理现有 lock 文件（如果有）...
if exist pnpm-lock.yaml (
    del pnpm-lock.yaml
    echo 已删除旧的 pnpm-lock.yaml
)

echo.
echo [2/3] 生成新的 lock 文件...
call pnpm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] pnpm install 失败
    pause
    exit /b 1
)

echo.
echo [3/3] 验证 lock 文件...
if exist pnpm-lock.yaml (
    echo ✅ pnpm-lock.yaml 已生成成功！

    echo.
    echo 文件信息:
    dir pnpm-lock.yaml | findstr pnpm-lock.yaml

    echo.
    echo ========================================
    echo ✅ 完成！现在可以提交到 GitHub 了
    echo ========================================
    echo.
    echo 提交命令:
    echo   git add pnpm-lock.yaml
    echo   git commit -m "chore: add pnpm-lock.yaml"
    echo   git push
    echo.
) else (
    echo [错误] pnpm-lock.yaml 未生成
    pause
    exit /b 1
)

pause
