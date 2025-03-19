import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    // provide the path to your Next.js app to 
    // load next.config.js and .env files in 
    // your test environment
    dir: './',
})

// add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to
// ensure that next/jest can load the Next.js
// config which is async
export default createJestConfig(config)