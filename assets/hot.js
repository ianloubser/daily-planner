const debugging = () => `#${Math.floor(Math.random()*16777215).toString(16)}ab`

const HotJS = (rootEl, documentRef, debugMode = false) => {
    var _root = rootEl || document
    var _document = documentRef || document
    window._state = {}

    var hotElements = {};
    const target = {
        flush: (...keys) => {
            keys.forEach((key) => {
                const item = hotElements[key];
                let element = _document.createElement(item.type);
                mergeDeep(element, item);
                renderTree(item, element);
                
                // if there is no diff, then don't add into DOM - since the assumption is DOM update takes longest instead 
                // of actually generating new elem in memory
                const currentNode = _root.getElementById(key);
                if (!currentNode.isEqualNode(element)) {
                    currentNode.replaceWith(element);
                }
            });
            return null;
        },
    };

    const isObject = (item) => {
        return item && typeof item === "object" && !Array.isArray(item);
    };

    const mergeDeep = (target, ...sources) => {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (typeof source[key] === 'function' && (key === 'className' || key === 'style')) {
                    if (key === 'style') {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        mergeDeep(target[key], source[key]());
                    } else {
                        Object.assign(target, { [key]: source[key]() });
                    }
                } else if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return mergeDeep(target, ...sources);
    };

    const renderTree = (child, element) => {
        if (child == null) return;

        if (typeof child === "function") {
            renderTree(child(), element);
        } else if (Array.isArray(child)) {
            child.forEach((c) => renderTree(c, element));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            element.appendChild(child);
        } else if (typeof child === 'object') {
            renderTree(child.child, element);
        } else {
            element.innerText = `${child}`;
        }
    };

    const makeRenderer = (prop) => {
        return (child) => {
            var element = _document.createElement(prop);
            if (child != null) {
                if (isObject(child)) {
                    if (child.id != null) {
                        hotElements[child.id] = { type: prop, ...child };
                    }

                    mergeDeep(element, child);
                }

                renderTree(child, element);
            }

            if (debugMode) {
                element.style.backgroundColor = debugging()
            }

            return element;
        };
    };

    const handler = {
        get: function (target, prop, receiver) {
            if (target[prop] != null) {
                return target[prop];
            }

            return makeRenderer(prop);
        },
    };

    return new Proxy(target, handler);
};

export default HotJS()
// export default HotJS(undefined, undefined, true)
