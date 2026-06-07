import {Component} from "vue";

export interface EditorTab {
    id: string
    label: string
    icon?: Component
    component: Component
    classes?: string
}