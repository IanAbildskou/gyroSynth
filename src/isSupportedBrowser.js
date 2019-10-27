import { detect } from 'detect-browser';
import config from './config';

export default () => {
  const browser = detect()
  return config.supportedBrowsers.includes(browser.name)
}
