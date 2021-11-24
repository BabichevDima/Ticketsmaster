import {parseRequestURL} from './helpers/utils.js';

import Header from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import About from './views/pages/about.js';
import Error404 from './views/pages/error404.js';

import Admin from './views/pages/adminFolder/admin.js';
import AdminPage from './views/pages/adminFolder/admin-page.js';

import AddAndList from './views/pages/concerts/add-list.js';
import ConcertInfo from './views/pages/concerts/concert-info.js';
import Confirm from './views/pages/concerts/confirm.js';

const Routes = {
    '/': About,
    '/concerts': AddAndList,
    '/admin': Admin,
    '/addedPage': AdminPage,
    '/concert/:id': ConcertInfo,
    '/concert/:id/:id/confirm': Confirm,
};

function router() {
    const headerContainer = document.getElementsByClassName('header-container')[0],
          contentContainer = document.getElementsByClassName('content-container')[0],
          footerContainer = document.getElementsByClassName('footer-container')[0],
          header = new Header(),
          footer = new Footer();

    header.render().then(html => headerContainer.innerHTML = html);

    const request = parseRequestURL(),
        parsedURL = `/${request.resource || ''}${request.id ? '/:id' : ''}${request.placeId ? '/:id' : ''}${request.action ? `/${request.action}` : ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    page.getData().then(data => {
		page.render(data).then(html => {
			contentContainer.innerHTML = html;
			page.afterRender();
		});
    });

    footer.render().then(html => footerContainer.innerHTML = html);
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);