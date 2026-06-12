import {Component} from "vue";

export interface EditorTab {
    label: string
    icon?: Component
    component?: Component
    classes?: string
}