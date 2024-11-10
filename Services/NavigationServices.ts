import { CommonActions, NavigationContainerRef } from '@react-navigation/native';

let navigator: NavigationContainerRef<any> | null = null;

export function setTopLevelNavigator(navigatorRef: NavigationContainerRef<any> | null) {
navigator = navigatorRef;
}

export function navigate(name: string, params?: object) {
if (navigator) {
navigator.dispatch(
  CommonActions.navigate({
    name,
    params,
  })
);
}
}

export function reset(routes: { name: string, params?: object }[], index: number = 0) {
if (navigator) {
navigator.dispatch(
  CommonActions.reset({
    index,
    routes,
  })
);
}
}