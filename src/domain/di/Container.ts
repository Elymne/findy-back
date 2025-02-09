import type { Injectable } from "./Injectable";

type Binding = () => object;

const bindings: Map<string, Binding> = new Map<string, Binding>();

export const Container = {
    add: function (key: Injectable, builder: Binding): void {
        bindings.set(key as string, builder);
    },

    get: function <T extends object>(key: Injectable): T {
        const binding = bindings.get(key as string);
        if (binding == undefined) {
            throw new Error(`Interface from enum key $key not found. Be sure to add any injectable Interface to IName enum and check that the interface has been added to Container.`);
        }
        return binding() as T;
    },
};
