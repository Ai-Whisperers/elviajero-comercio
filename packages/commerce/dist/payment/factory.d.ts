export interface PaymentRequest {
    order: {
        id: string;
        [key: string]: any;
    };
    total: number;
    items?: any[];
    customer?: {
        email?: string;
        name?: string;
        [key: string]: any;
    };
    [key: string]: any;
}
export interface GatewayResult {
    ok: boolean;
    sandbox?: boolean;
    redirectUrl?: string;
    url?: string;
    error?: any;
}
export interface GatewayAdapter {
    name: string;
    processPayment: (req: PaymentRequest) => Promise<GatewayResult>;
}
export declare function registerGateway(adapter: GatewayAdapter): void;
export declare function getGateway(name: string): GatewayAdapter | undefined;
export declare function getRegisteredGateways(): string[];
//# sourceMappingURL=factory.d.ts.map