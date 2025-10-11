import { BaseForm } from './BaseForm';

export interface MemberEditForm extends BaseForm {
    id?: number;
    name: string;
    phone: string;
    address: string;
    district: string;
    province: string;
    zipCode: string;
    user: string;
    password: string;
    classType: string;
}

export interface MemberRequest {
    id?: number;
    name: string;
    phone: string;
    address: string;
    district: string;
    province: string;
    zipCode: string;
    user: string;
    password: string;
    classType: string;
}

export interface MemberSearchForm {
    name: string;
    user?: string;
}