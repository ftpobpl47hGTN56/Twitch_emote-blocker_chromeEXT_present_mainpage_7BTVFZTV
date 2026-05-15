// js/service_worker.js
console.log('[SW] Service worker started');

const CSS_FILES = [
  'css/styles.css',
  'css/Twitch_better_Styles/fix_twitch_styles.css',
  'css/Twitch_better_Styles/twitch_main_Styles_but_Better.css',
  'css/Twitch_better_Styles/chat-reply-ffz-fix-reply-line-message.css',
  'css/Slate_corrector_twitch/chat-wysiwyg-input-slate-box.css',
  'css/Lists.css',
  'css/open-panel-button.css',
  'css/resize-control-panel.css',
  'css/data-selection-modal.css',
  'css/emote-preview-container.css',
  'css/notifications.css',
  'css/ios-switch-for-notifications.css',
  'css/sort-chatbanned-items.css',
  'css/rename_users_twtch.css',
  'css/toggle-media-preview-button.css',
  'css/chat_flow_animation.css',
  'css/chat_line_mentionspam_webkit-scrollbar.css',
  'css/chart_stats_modal.css',
  'css/emote-selection-popup.css',
  'css/panelSettings.css',
];

const JS_FILES = [
   'js/globals.js', 
  'js/7BTVFZ__storage.js',
  'js/Logging___7BTVFZ__PANEL.js',
  'js/notifications.js',
  'js/themes.js',
  'js/enable__disableBlocking.js',
  'js/emojiSpamProtection.js',
  'js/ChatFilter.js',
  'js/blocking_emotes.js',
  'js/init_Blocking.js',
  'update_UIList_/_List_Utils_.js',
  'update_UIList_/emote_preview_.js',
  'update_UIList_/highlight_List_.js',
  'update_UIList_/update_BlockedEmotesList.js',
  'update_UIList_/update_BannedChatList.js',
  'update_UIList_/filter_list_search.js',
  'update_UIList_/counter_update.js',
  'UI_Sorter/sorter_items_List.js',
  'UI_Modal_import-export/animate_modals.js',
  'js/delete_add_clear_data.js',
  'js/emotePickerHandler.js',
  'js/Draggable_and_Resizable_Panel.js',
  'js/panel__Settings.js',
  'js/import_export_DATA.js',
  'js/bindButtonHandlers.js',
  'js/PreviewerMedia.js',
  'js/chat_recycler.js',
  'js/showStats_blockedItems.js',
  'js/ignor-chat-user-button-hover.js',
  'js/UNignor-chat-user-button-hover.js',
  'js/chat_smooth_scroller.js',
  'popup_emotes_chat/Emote_Popup_Utils.js',
  'popup_emotes_chat/7TV_BtTV_FFZ_Popup.js',
  'popup_emotes_chat/twitch_FFZ_Popup.js',
  'popup_emotes_chat/get_FfzTooltipEmotes.js',
  'popup_emotes_chat/send_in-chat_from-popup-emote.js',
  'rename-users-nickname/constants.js',
  'rename-users-nickname/core.js',
  'rename-users-nickname/ui.js',
  'rename-users-nickname/init.js',
  'rename-users-nickname/Twitch_Viewer_Card-data-user-account.js',
  'Slate_corrector_twitch/Slate_reset_input_type_delete_text.js',
  'Slate_corrector_twitch/garbage_atribute_delete.js',
  'Slate_corrector_twitch/textarea_autodelete-text-input.js',
  'js/ui.js',
  'js/init_UI.js',
  'Js/created_acc_viewer-card.js',
   'js/combined.js', 
  'js/entry.js',
    // --- bug_fixes_userscripts ---
  'bug_fixes_userscripts/animation_chat-gradientWave__message.js',
  'bug_fixes_userscripts/autoclose_twitchDropps.js',
  'bug_fixes_userscripts/autocomplete_data_login_twitchuser.js',
  'bug_fixes_userscripts/AUToDelete_invisible_ChatinPUT_symbol.js',
  'bug_fixes_userscripts/autofix_displayname_into_login_chat_reply.js',
  'bug_fixes_userscripts/auto_chat_open_nostream_page.js',
  'bug_fixes_userscripts/auto_hide_spam_mentions.js',
  'bug_fixes_userscripts/auto_paste_login_input_chat.js',
  'bug_fixes_userscripts/auto_send_anyway.js',
  'bug_fixes_userscripts/chat-line__message-mention_username_delete_Duplication.js',
  'bug_fixes_userscripts/chat_border_lines_3D.js',
  'bug_fixes_userscripts/chat_button_0ff_ON.js',
  'bug_fixes_userscripts/chat_poputBttn.js',
  'bug_fixes_userscripts/collapse_expand_chat_input_tray.js',
  'bug_fixes_userscripts/ColonReplacer_in_chat.js',
  'bug_fixes_userscripts/colorizer_username_twichchat.js',
  'bug_fixes_userscripts/delete_combo_promo_ADS.js',
  'bug_fixes_userscripts/delete_symbols_profile_User.js',
  'bug_fixes_userscripts/delete_symbol_SPACE_in_LOGIN_chatline_mssg.js',
  'bug_fixes_userscripts/ffz_auto_0FF_badges.js',
  'bug_fixes_userscripts/ffz_compressor_range_css_fix.js',
  'bug_fixes_userscripts/FFZ_Save_emote_position_viewer_card_motes.js',
  'bug_fixes_userscripts/ffz_Select_All_Disable_badges.js',
  'bug_fixes_userscripts/fix_autofocus_input_twtch_chat.js',
  'bug_fixes_userscripts/FIX_none_latin_login_chat_line_message.js',
  'bug_fixes_userscripts/hide_stream_Twitch_tittle_tooltip.js',
  'bug_fixes_userscripts/Inject_css_chat_opentray_list.js',
  'bug_fixes_userscripts/media_uploader.js',
  'bug_fixes_userscripts/nickName_gradient_color.js',
  'bug_fixes_userscripts/pratleNot__autoscroll.js',
  'bug_fixes_userscripts/Seek-Bar_auto_0FF.js',
  'bug_fixes_userscripts/SVG_loadingTwitch-Stream_custom.js',
  'bug_fixes_userscripts/toggle_captions_subtitles_Button_.js',
  'bug_fixes_userscripts/Twitch_Auto_reload_when_stuck_v0_2_4_25.js',
  'bug_fixes_userscripts/video-quality_LocalStorage_twitch_1080p60.js',

];

const MATCH_PATTERNS = [
  { hostContains: 'twitch.tv' },
  { hostContains: 'twitchtracker.com' },
];

function shouldSkip(url) {
  return (
    url.includes('player.twitch.tv') ||
    (url.includes('twitch.tv/embed') && !url.includes('popout'))
  );
}

async function injectIntoTab(tabId, frameId, url) {
  if (shouldSkip(url)) return;
  try {
    await chrome.scripting.insertCSS({
      target: { tabId, frameIds: [frameId] },
      files: CSS_FILES,
    });

    // Все JS в ОДНОМ executeScript — общий скоп
    await chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      files: JS_FILES,
      world: 'ISOLATED',
    });

    console.log(`[SW] Injected into tab ${tabId} frame ${frameId}: ${url}`);
  } catch (err) {
    console.error(`[SW] Injection failed:`, err.message);
  }
}
// ← ОДИН листенер
chrome.webNavigation.onDOMContentLoaded.addListener(
  (details) => {
    console.log('[SW] fired:', details.url, 'frameId:', details.frameId);
    injectIntoTab(details.tabId, details.frameId, details.url);
  },
  { url: MATCH_PATTERNS }
);

// ← ОДИН onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({
    url: ['https://www.twitch.tv/*', 'https://*.twitch.tv/*', 'https://twitchtracker.com/*'],
  });
  for (const tab of tabs) {
    if (tab.id && tab.url) {
      injectIntoTab(tab.id, 0, tab.url);
    }
  }
});