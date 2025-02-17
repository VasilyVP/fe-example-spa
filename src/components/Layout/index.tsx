import { ReactNode } from 'react';
import Head from './Head';

type LayoutProps = {
    children: ReactNode | ReactNode[];
}
export default ({ children }: LayoutProps) => {
    return (
        <>
            <Head />
            {children}
        </>
    )
}
