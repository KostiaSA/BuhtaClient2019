import * as ReactDOMServer from 'react-dom/server';

export function notifyError(message: React.ReactNode) {
    var elemDiv = document.createElement('div');
    $(elemDiv).html(ReactDOMServer.renderToStaticMarkup(message as any));
    document.body.appendChild(elemDiv);
    ($(elemDiv) as any).jqxNotification({autoOpen: true, template:"error"});
}
