/**
 * Should match main/preload.ts for typescript support in renderer
 */
import { IpcRendererEvent } from 'electron';
import {ElectronApi} from '../../main/preload';

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
