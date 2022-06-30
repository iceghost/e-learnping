import { Info } from '..';

export const GetSiteInfo = {
    encode() {
        return {
            wsfunction: 'core_webservice_get_site_info',
        };
    },
    decode(body: Info) {
        return body;
    },
};
