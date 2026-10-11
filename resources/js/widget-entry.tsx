import React from 'react';
import ReactDOM from 'react-dom/client';
import { IndoorFarming3D, IndoorFarming3DProps } from './Pages/Welcome';
import '../../resources/css/app.css';

export interface MountOptions extends IndoorFarming3DProps {
    container?: HTMLElement | string;
}

const mountedRoots = new Map<HTMLElement, ReactDOM.Root>();

/**
 * Mount the 3D Indoor Farming Simulation Widget into a DOM element.
 * 
 * Example usage:
 * ```javascript
 * const sim = window.IndoorFarming3D.mount('#indoor-farming-3d-root', {
 *     onActuatorChange: (name, val) => console.log('Actuator changed:', name, val),
 * });
 * ```
 */
export function mount(target?: HTMLElement | string | MountOptions, options?: MountOptions) {
    let containerEl: HTMLElement | null = null;
    let opts: MountOptions = {};

    if (typeof target === 'string') {
        containerEl = document.querySelector(target);
        opts = options || {};
    } else if (target instanceof HTMLElement) {
        containerEl = target;
        opts = options || {};
    } else if (target && typeof target === 'object') {
        opts = target;
        if (typeof opts.container === 'string') {
            containerEl = document.querySelector(opts.container);
        } else if (opts.container instanceof HTMLElement) {
            containerEl = opts.container;
        }
    }

    if (!containerEl) {
        containerEl = document.getElementById('indoor-farming-3d-root');
    }

    if (!containerEl) {
        console.error('[IndoorFarming3D] Target container element not found. Please provide a valid HTMLElement or selector.');
        return null;
    }

    if (mountedRoots.has(containerEl)) {
        console.warn('[IndoorFarming3D] Already mounted on this container. Unmounting previous instance first.');
        unmount(containerEl);
    }

    const root = ReactDOM.createRoot(containerEl);
    root.render(
        <React.StrictMode>
            <IndoorFarming3D isStandalone={true} {...opts} />
        </React.StrictMode>
    );
    mountedRoots.set(containerEl, root);
    return root;
}

/**
 * Unmount the 3D simulation and cleanly dispose of its resources.
 */
export function unmount(target?: HTMLElement | string) {
    let containerEl: HTMLElement | null = null;
    if (typeof target === 'string') {
        containerEl = document.querySelector(target);
    } else if (target instanceof HTMLElement) {
        containerEl = target;
    } else {
        containerEl = document.getElementById('indoor-farming-3d-root');
    }

    if (containerEl && mountedRoots.has(containerEl)) {
        mountedRoots.get(containerEl)!.unmount();
        mountedRoots.delete(containerEl);
    }
}

// Expose on window object
if (typeof window !== 'undefined') {
    (window as any).IndoorFarming3D = {
        mount,
        unmount,
    };

    // Auto-mount on DOMContentLoaded if a div with id="indoor-farming-3d-root" exists
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const defaultRoot = document.getElementById('indoor-farming-3d-root');
            if (defaultRoot && defaultRoot.getAttribute('data-auto-mount') !== 'false') {
                mount(defaultRoot);
            }
        });
    } else {
        const defaultRoot = document.getElementById('indoor-farming-3d-root');
        if (defaultRoot && defaultRoot.getAttribute('data-auto-mount') !== 'false') {
            mount(defaultRoot);
        }
    }
}

export default { mount, unmount };
