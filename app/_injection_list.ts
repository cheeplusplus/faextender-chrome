import { getSiteVersion } from "./common_fa";

type InjectionPointPath<T> = {
    [P in keyof T]: string;
};

interface InjectionVersions {
    classic: InjectionPointPath<InjectionPoints>;
    beta: InjectionPointPath<InjectionPoints>;
}

interface InjectionPoints {
    downloadInsertPosition: HTMLDivElement;
    downloadLink: HTMLAnchorElement;
    artistLink: HTMLAnchorElement;
    addFavoriteLink: HTMLAnchorElement;
    miniGallery: HTMLElement;
    journalHighlightMatch: HTMLLIElement;
    submissionHighlightMatch: HTMLAnchorElement;
    standardSubmissionLink: HTMLAnchorElement;
    insertInTabsInsertPositionSubmissions: HTMLDivElement;
    insertInTabsInsertPositionGallery: HTMLDivElement;
    insertInTabsInsertPositionFavorites: HTMLDivElement;
    openInGDocsInsertPosition: HTMLElement;
}

export type InjectionPoint = keyof InjectionPoints;

const InjectionPointList: InjectionVersions = {
    "classic": {
        "downloadInsertPosition": "#page-submission .maintable:first th.cat",
        "downloadLink": "#page-submission div.actions a:contains('Download')",
        "artistLink": "#page-submission table.maintable td.cat div.information a[href*='/user/']",
        "addFavoriteLink": "a[href^='/fav/']:contains('+Add to Favorites')",
        "miniGallery": "#page-submission div.minigalleries",
        "journalHighlightMatch": "#messages-journals ul.message-stream li",
        "submissionHighlightMatch": "#messagecenter-submissions section.gallery figure",
        "standardSubmissionLink": "figure a[href*='/view/']",
        "insertInTabsInsertPositionSubmissions": "#messagecenter-submissions div.actions",
        "insertInTabsInsertPositionGallery": "#page-galleryscraps div.page-options",
        "insertInTabsInsertPositionFavorites": "#favorites table.maintable>tbody>tr>td>table>tbody>tr:nth-child(1)>td:nth-child(1)",
        "openInGDocsInsertPosition": "#page-submission div.actions a:contains('Download')"
    },
    "beta": {
        "downloadInsertPosition": "#submission_page div.submission-sidebar",
        "downloadLink": "#submission_page section.buttons div.download a:contains('Download')",
        "artistLink": "#submission_page div.submission-content div.submission-id-sub-container a[href*='/user/']",
        "addFavoriteLink": "a[href^='/fav/']:contains('+ Fav')",
        "miniGallery": "#submission_page section.minigallery-more div.preview-gallery",
        "journalHighlightMatch": "#messages-journals ul.message-stream li",
        "submissionHighlightMatch": "#messagecenter-submissions section.gallery figure",
        "standardSubmissionLink": ".gallery-section figure a[href*='/view/']",
        "insertInTabsInsertPositionSubmissions": "#messagecenter-new-submissions .actions-section div.aligncenter",
        "insertInTabsInsertPositionGallery": "#page-galleryscraps div.submission-list div.aligncenter",
        "insertInTabsInsertPositionFavorites": "#standardpage div.aligncenter",
        "openInGDocsInsertPosition": "#submission_page section.buttons"
    }
};

export function getInjectionPoint(point: keyof InjectionPoints): string {
    const ver = getSiteVersion();
    return InjectionPointList[ver][point];
}

export function getInjectionElement<T extends keyof InjectionPoints, Y extends InjectionPoints[T]>(point: T): JQuery<Y> {
    const target = getInjectionPoint(point);
    return jQuery<Y>(target);
}
