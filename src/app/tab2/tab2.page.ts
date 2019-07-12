import {Component} from '@angular/core';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})

export class Tab2Page
{
    private search = document.querySelector('#hy-search-bar');
    private itemList = document.querySelector('#hy-item-list');

    public itemListArray = ['12', '3'];

    constructor()
    {
        console.log("Tab2Page.constructor()");
    }

    refresh()
    {
        console.log("Refresh()");

        this.search.addEventListener('ionInput', handleInput);

        function handleInput(event)
        {
            const query = event.target.value.toLowerCase();
            requestAnimationFrame(() =>
            {
                /*
                items.forEach(item =>
                {
                    const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
                    item.style.display = shouldShow ? 'block' : 'none';
                });*/
            });
        }
    }
}
