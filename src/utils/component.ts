import {isElement, isObject, tryParse} from "./object";
import {values} from "lodash";
import {flatten} from "./array";

export const defineComponent = (tagName: string, constructor: Function, namespace?:string) => {
    if(namespace) {
        tagName = `${namespace}-${tagName}`;
    }

    if (!customElements.get(tagName)) customElements.define(tagName, constructor);
    return customElements.get(tagName);
};

export const findInSlot = (element, selector): any => {
    const found = getSlotElements(element).filter((element) => {
        return element.matches(selector);
    });
    return found[0];
};

export const findInNamedSlot = (element, slotName, selector): any => {
    const found = getSlotElementsByName(element, slotName).filter((element) => {
        console.log(element)
        return element.matches(selector);
    });
    return found[0];
};

export const findInNamedSlotDeep = (element, slotName, selector): any => {
    const found = getSlotElementsByName(element, slotName).map((element) => {
        const root = element.shadowRoot || element;
        return root.querySelectorAll(selector);
    });
    return flatten(found);
};

export const getSlotElementsByName = (element, name) => {
    const slot = getSlotByName(element, name);
    return flatten(slotAssignedElements(slot));
};

export const getSlotByName = (element, name) => {
    const root = element.shadowRoot || element;
    return root.querySelector(`slot[name=${name}]`)
};

export const datasetToProps = (el: HTMLElement) => {
    for (let key in el.dataset) {
        if (el[key]) {
            const dataVal = tryParse(el.dataset[key]);
            if (isObject(dataVal)) {
                for (let subKey in dataVal) {
                    el[key][subKey] = dataVal[subKey];
                }
            } else {
                el[key] = dataVal;
            }
        }
    }
};

export const mergeDefaults = (el: HTMLElement, mergeableProps: Array<string>) => {
    mergeableProps.forEach((mergeableProp) => {
        if (el[`${mergeableProp}Defaults`]) {
            if (Array.isArray(el[mergeableProp])) {
                el[mergeableProp] = el[`${mergeableProp}Defaults`].map((item, i) => {
                    return {...item, ...el[mergeableProp][i]}
                });
            } else {
                el[mergeableProp] = {...el[`${mergeableProp}Defaults`], ...el[mergeableProp]}
            }

        }
    })
};

const getSlotElements = (element): any => {
    return values(slotAssignedElements(getSlot(element)));
};

const getSlot = (element): HTMLSlotElement => {
    const root = element.shadowRoot || element;
    return root.querySelector('slot')
};

const slotAssignedElements = (slot) => {
    if (!slot || !slot.assignedNodes) return;
    return slot.assignedNodes().map((node) => {
        if (node.nodeName === 'SLOT') {
            return slotAssignedElements(node)
        }
        if (isElement(node)) {
            return <HTMLElement>node;
        }
    }).filter(element => element)
};

export const getSlottedContent = (el, slotName, defaultContent = null)  =>{
    if(hasSlotted(el, slotName)) {
        if(!el.slotted) {
            el.slotted = {};
        }
        if(!el.slotted[slotName]){
            el.slotted[slotName] = getClonedSlotted(el,slotName)
        }
        return el.slotted[slotName]
    }

    if(defaultContent){
        return defaultContent;
    }
    
    return '';
}

export const hasSlotted = (el, slotName) => {
    return el.querySelector(`[slot="${slotName}"]`)
}

export const getClonedSlotted =(el, slotName) => {
    return el.querySelector(`[slot="${slotName}"]`).cloneNode(true)
}