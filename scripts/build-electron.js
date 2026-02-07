const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 에러를 유발하는 next-auth 라우트 파일 경로
const targetFile = path.join(__dirname, '../src/app/api/auth/[...nextauth]/route.js');
const backupFile = targetFile + '.bak';

function run() {
    let fileRenamed = false;

    try {
        // 1. Rename route.js to route.js.bak if it exists
        if (fs.existsSync(targetFile)) {
            console.log('--- 빌드 방해 요인(next-auth)을 잠시 격리 중... ---');
            fs.renameSync(targetFile, backupFile);
            fileRenamed = true;
        }

        // 2. Next.js Static Export Build
        console.log('--- Next.js 정적 빌드 시작... ---');
        // 윈도우에서는 npx 대신 직접 다음처럼 호출하는 것이 더 안전할 수 있습니다.
        execSync('npm run build', { stdio: 'inherit' });

        // 3. Electron Builder
        console.log('--- Electron .exe 패키징 시작... ---');
        execSync('npx electron-builder', { stdio: 'inherit' });

        console.log('\n✅ 빌드 성공! dist 폴더에서 .exe 파일을 확인하세요.');

    } catch (error) {
        console.error('\n❌ 빌드 중 오류가 발생했습니다.');
        // 상세 에러는 이미 inherit으로 출력됨
    } finally {
        // 4. 원래대로 복구
        if (fileRenamed && fs.existsSync(backupFile)) {
            console.log('--- 파일 복구 중... ---');
            fs.renameSync(backupFile, targetFile);
        }
    }
}

run();
