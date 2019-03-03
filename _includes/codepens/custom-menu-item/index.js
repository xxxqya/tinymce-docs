tinymce.init({
  selector: "textarea#custom-toolbar-menu-item",
  height: 500,
  toolbar: false,
  menubar: "custom",
  menu: {
    custom: { title: "Custom menu", items: "basicitem nesteditem toggleitem" }
  },
  content_css: [
    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    '//www.tiny.cloud/css/codepen.min.css'
  ],
  setup: function (editor) {
    // Menu items are recreated when the menu is closed and opened, so we need
    // a variable to store the toggle menu item state.
    var toggleState = false;

    editor.ui.registry.addMenuItem('basicitem', {
      text: 'My basic menu item',
      onAction: function () {
        editor.insertContent('<p>Here\'s some content inserted from a basic menu!</p>');
      }
    });

    editor.ui.registry.addNestedMenuItem('nesteditem', {
      text: 'My nested menu item',
      getSubmenuItems: function () {
        return [
          {
            type: 'menuitem',
            text: 'My submenu item',
            onAction: function () {
              editor.insertContent('<p>Here\'s some content inserted from a submenu item!</p>');
            }
          }
        ];
      }
    });

    editor.ui.registry.addToggleMenuItem('toggleitem', {
      text: 'My toggle menu item',
      onAction: function () {
        toggleState = !toggleState;
        editor.insertContent('<p class="toggle-item">Here\'s some content inserted from a toggle menu!</p>');
      },
      onSetup: function (api) {
        api.setActive(toggleState);
        return function () {};
      }
    });
  }
});