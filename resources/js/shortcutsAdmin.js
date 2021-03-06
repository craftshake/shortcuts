(function($) {

var ShortcutsAdmin = Garnish.Base.extend({

    $groups: null,
    $selectedGroup: null,

    init: function()
    {
        this.$groups = $('#groups');
        this.$selectedGroup = this.$groups.find('a.sel:first');
        this.addListener($('#newgroupbtn'), 'activate', 'addNewGroup');

        var $groupSettingsBtn = $('#groupsettingsbtn');

        if ($groupSettingsBtn.length)
        {
            var menuBtn = $groupSettingsBtn.data('menubtn');

            menuBtn.settings.onOptionSelect = $.proxy(function(elem)
            {
                var action = $(elem).data('action');

                switch (action)
                {
                    case 'rename':
                    {
                        this.renameSelectedGroup();
                        break;
                    }
                    case 'delete':
                    {
                        this.deleteSelectedGroup();
                        break;
                    }
                }
            }, this);
        }
    },

    addNewGroup: function()
    {
        var name = this.promptForGroupName('');

        if (name)
        {
            var data = {
                name: name
            };

            Craft.postActionRequest('shortcuts/saveGroup', data, $.proxy(function(response)
            {
                if (response.success)
                {
                    location.href = Craft.getUrl('shortcuts/'+response.group.id);
                }
                else
                {
                    var errors = this.flattenErrors(response.errors);
                    alert(Craft.t('Could not create the group:')+"\n\n"+errors.join("\n"));
                }

            }, this));
        }
    },

    renameSelectedGroup: function()
    {
        var oldName = this.$selectedGroup.text(),
            newName = this.promptForGroupName(oldName);

        if (newName && newName != oldName)
        {
            var data = {
                id:   this.$selectedGroup.data('id'),
                name: newName
            };

            Craft.postActionRequest('fields/saveGroup', data, $.proxy(function(response)
            {
                if (response.success)
                {
                    this.$selectedGroup.text(response.group.name);
                    Craft.cp.displayNotice(Craft.t('Group renamed.'));
                }
                else
                {
                    var errors = this.flattenErrors(response.errors);
                    alert(Craft.t('Could not rename the group:')+"\n\n"+errors.join("\n"));
                }

            }, this));
        }
    },

    promptForGroupName: function(oldName)
    {
        return prompt(Craft.t('What do you want to name your group?'), oldName);
    },

    deleteSelectedGroup: function()
    {
        if (confirm(Craft.t('Are you sure you want to delete this group and all its shortcuts?')))
        {
            var data = {
                id: this.$selectedGroup.data('id')
            };

            Craft.postActionRequest('shortcuts/deleteGroup', data, $.proxy(function(response)
            {
                if (response.success)
                {
                    location.href = Craft.getUrl('shortcuts');
                }
                else
                {
                    alert(Craft.t('Could not delete the group.'));
                }
            }, this));
        }
    },

    flattenErrors: function(responseErrors)
    {
        var errors = [];

        for (var attribute in responseErrors)
        {
            errors = errors.concat(response.errors[attribute]);
        }

        return errors;
    }
});


Garnish.$doc.ready(function()
{
    Craft.ShortcutsAdmin = new ShortcutsAdmin();
});

})(jQuery);
