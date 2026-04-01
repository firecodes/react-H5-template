
import { get } from '@/axios';

/** 测试接口 */
export const GetCaptcha = (params: unknown) => get<{ captchaImg: string }>('api/captcha', params);
