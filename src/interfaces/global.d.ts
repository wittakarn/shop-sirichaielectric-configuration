interface Application {
    root: string;
    contextRoot: string;
    shopUrl: string;
    user: {
        username: string;
        fullName: string;
        roles: string;
    };
    thaiVat: number;
    quotationAvailable: boolean;
}

declare const application: Application