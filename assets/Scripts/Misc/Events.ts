/**
 * Local events.
 * @author wheatup
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Events{
	/**
	 * When the scribble game officially started
	 * @param online boolean
	 * @param data 
	 */
	public static GAME_START: string = 'GAME_START';

	/**
	 * When the single player game is ready to go
	 */
	public static GAME_READY: string = 'GAME_READY';

	/**
	 * When player clicked the play online button
	 */
	public static MULTIPLAYER: string = 'MULTIPLAYER';
	
	/**
	 * When started to load config
	 */
	public static LOAD_CONFIG: string = 'LOAD_CONFIG';

	/**
	 * When config is successfully loaded
	 * @param config
	 */
	public static LOADED_CONFIG: string = 'LOADED_CONFIG';

	/**
	 * @param name resource name
	 * When started to load additional resources
	 */
	public static LOAD_RESOURCE: string = 'LOAD_RESOURCE';

	/**
	 * When resources are successfully loaded
	 * @param name resource name
	 * @param data resource data
	 */
	public static LOADED_RESOURCE: string = 'LOADED_RESOURCE';

	/**
	 * When the player's word chain changes
	 * @params hexagon array
	 */
	public static CHAIN: string = 'CHAIN';

	/**
	 * When a tip shows up
	 * @param tip message, hide the tip if it's falsy
	 * @param time how long will the tip be shown, less or equal than 0 is infinite
	 */
	public static TIP: string = 'TIP';

	/**
	 * When the server is down
	 */
	public static LOST_CONNECTION: string = 'LOST_CONNECTION';

	/**
	 * When player got something wrong
	 * @param ids the hexagon ids
	 * @param word the word player was trying to make
	 */
	public static WRONG: string = 'WRONG';

	/**
	 * When player got a word
	 * @param me is me got it or not
	 * @param ids the hexagon ids
	 * @param word the word player got
	 * @param letters the replacement
	 * @param score the score
	 */
	public static CORRECT: string = 'CORRECT';

	/**
	 * Need to go to main menu
	 */
	public static MAIN_MENU: string = 'MAIN_MENU';
}
