export type Resolvable<T> = Promise<T> & {
    resolve: (t: T) => void;
    reject: (e: any) => void;
};
declare const _default: <T = void>() => Resolvable<T>;
export default _default;
//# sourceMappingURL=resolvable.d.ts.map