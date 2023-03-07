class Path {
    static instance;

    constructor() {
        this.url = window.location;
    }

    static get_instance() {
        if (!Path.instance)
            Path.instance = new Path();
        return Path.instance;
    }

    update_url() {
        console.log('updating the url');
    }

    save_url() {
        console.log('saving the url');
    }
}
