/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_MP_SERVER_VERIFY?: string;
	readonly VITE_MP_VERIFY_MODE?: 'off' | 'mock' | 'live';
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
