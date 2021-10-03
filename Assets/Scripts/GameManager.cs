using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using DG.Tweening;
using System.Linq;

public class GameManager : MonoBehaviour
{
    #region Methods

    static public GameManager GetInstance()
    {
        if (Instance == null)
        {
            GameObject gameMangerObj = GameObject.FindGameObjectWithTag("GameManager");
            Instance = gameMangerObj.GetComponent<GameManager>();
        }

        return Instance;
    }

    private void Awake()
    {
        _audioSrc = GetComponent<AudioSource>();

        // Game Initialization
        _partyRelation = new int[3] { 30, 30, 30 };
        _hearts = 10;

        // Create meeting deck
        _meetingPool = new List<MeetingBlock>();
        for (int i = 0; i < numBreak; i ++)
        {
            MeetingBlock newMeetingBlock = CreateNewMeetingBlock();
            newMeetingBlock.SetMeetingContent(true, null);
           _meetingPool.Add(newMeetingBlock);
        }
        for (int i= 0; i < NPC.NumNPCType; i ++)
        {
            for (int j = 0; j < numImportantNPCEachType; j ++)
            {
                MeetingBlock newMeetingBlock = CreateNewMeetingBlock();
                newMeetingBlock.SetMeetingContent(false, new NPC(i, 1));
                _meetingPool.Add(newMeetingBlock);
            }
            for (int j = 0; j < numRegularNPCEachType; j++)
            {
                MeetingBlock newMeetingBlock = CreateNewMeetingBlock();
                newMeetingBlock.SetMeetingContent(false, new NPC(i, 0));
                _meetingPool.Add(newMeetingBlock);
            }
        }

        // Shuffle meeting pool
        _meetingPool = _meetingPool.OrderBy(x => Random.value).ToList();
        for(int i = 0; i < _meetingPool.Count; i++)
        {
            _meetingPool[i].GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -i * MeetingBlockStride);
        }

    }

    private MeetingBlock CreateNewMeetingBlock()
    {
        GameObject newMeetingBlockObj = Instantiate(MeetingBlockPrefab, MeetingBlocksContainer.transform);
        MeetingBlock newMeetingBlock = newMeetingBlockObj.GetComponent<MeetingBlock>();
        return newMeetingBlock;
    }

    public void PlayClickSFX()
    {
        _audioSrc.PlayOneShot(Resources.Load<AudioClip>(ResourceLibrary.ClickSFXPath));
    }

    public void PlayHeartRestoredSFX()
    {
        _audioSrc.PlayOneShot(Resources.Load<AudioClip>(ResourceLibrary.HeartRestoredSFXPath));
    }

    public void PlayRelationIncreasedSFX()
    {
        _audioSrc.PlayOneShot(Resources.Load<AudioClip>(ResourceLibrary.RelationIncreasedSFXPath));
    }

    public void PlayRelationDecreasedSFX()
    {
        _audioSrc.PlayOneShot(Resources.Load<AudioClip>(ResourceLibrary.RelationDecreasedSFXPath));
    }

    static private string GetCommunityName(MeetingBlock meetingBlock)
    {
        int guestType = meetingBlock.Guest.Type;
        string communityName = "";
        if (guestType == 0)
        {
            communityName = "cat";
        }
        else if (guestType == 1)
        {
            communityName = "duck";
        }
        else if (guestType == 2)
        {
            communityName = "squirrel";
        }

        return communityName;
    } 

    public void TwoHeartResponse()
    {
        _npcResponse = _currMeetingBlock.Dialog.NPCResponse1[LanguageSetting];
        string communityName = GetCommunityName(_currMeetingBlock);
        _resultText = "The " + communityName + " community is more friendly towards you now.  \nYou lost two hearts.";
        _relationChange = relationIncreaseDelta * (_currMeetingBlock.Guest.Importance + 1);
        _heartChange = -2;
        ShowPlayerDialog(_currMeetingBlock.Dialog.PlayerResponse1[LanguageSetting] + " (<color=green>+" + _relationChange.ToString() + "</color>)");
    }

    public void OneHeartResponse()
    {
        _npcResponse = _currMeetingBlock.Dialog.NPCResponse2[LanguageSetting];
        string communityName = GetCommunityName(_currMeetingBlock);
        _resultText = "The " + communityName + " community wasn't impressed by you. \n You lost one heart.";
        _relationChange = 0;
        _heartChange = -1;
        ShowPlayerDialog(_currMeetingBlock.Dialog.PlayerResponse2[LanguageSetting] + " (" + _relationChange.ToString() + ")");
    }

    public void ZeroHeartResponse()
    {
        _npcResponse = _currMeetingBlock.Dialog.NPCResponse3[LanguageSetting];
        string communityName = GetCommunityName(_currMeetingBlock);
        _resultText = "The " + communityName + " community is less friendly towards you now.\nBeing yourself feels great. You gained one heart.";
        _relationChange = - (relationDecreaseDelta * (_currMeetingBlock.Guest.Importance + 1));
        _heartChange = 1;
        ShowPlayerDialog(_currMeetingBlock.Dialog.PlayerResponse3[LanguageSetting] + " (<color=red>" + _relationChange.ToString() + "</color>)");
    }

    public void ShowNPCResponse()
    {
        if (_npcDialogBox != null)
        {
            _npcDialogBox.GetComponentInChildren<Text>().text = _npcResponse;
        }
        PlayerDialogBox.SetActive(false);
        ChooseResponsePrompt.SetActive(false);
        MeetingResultDisplay.SetActive(true);
        MeetingResultDisplay.GetComponent<Text>().text = _resultText;
        _partyRelation[_currMeetingBlock.Guest.Type] += _relationChange;
        _hearts += _heartChange;
        if (_relationChange > 0)
        {
            PlayRelationIncreasedSFX();
        } else if (_relationChange < 0)
        {
            PlayRelationDecreasedSFX();
        }
        if (_partyRelation[_currMeetingBlock.Guest.Type] <= 0)
        {
            string loseMessage = "The " + GetCommunityName(_currMeetingBlock) + " community could not put up with your arrogance. You're fired.";
            Lose(loseMessage);
        } else if (_partyRelation[_currMeetingBlock.Guest.Type] >= 100)
        {
            string winMessage = "Congratulations! The " + GetCommunityName(_currMeetingBlock) + " community recommended you for a promotion!";
            Win(winMessage);
        }

        FinishUpMeeting(_currMeetingBlock);
    }

    private void ShowPlayerDialog(string content)
    {
        PlayerDialogBox.SetActive(true);
        PlayerDialogBox.GetComponentInChildren<Text>().text = content;
    }

    private void Win(string winMessage)
    {
        EndOfGamePanel.SetActive(true);
        EndOfGamePanel.GetComponentInChildren<Text>().text = winMessage;
    }

    private void Lose(string loseMessage)
    {
        EndOfGamePanel.SetActive(true);
        EndOfGamePanel.GetComponentInChildren<Text>().text = loseMessage;
    }

    public void NextMeeting()
    {
        MeetingResultDisplay.SetActive(false);

        if (_meetingScreen != null)
        {
            GameObject.Destroy(_meetingScreen);
            _meetingScreen = null;
        }

        if (_npcDialogBox != null)
        {
            GameObject.Destroy(_npcDialogBox);
            _npcDialogBox = null;
        }

        _currMeetingBlock = _meetingPool[0];

        if (!_currMeetingBlock.IsBreak) {
             DisplayMeetingElement(_currMeetingBlock);
             ShowDialogOpening(_currMeetingBlock);
        } else
        {
            MeetingResultDisplay.SetActive(true);
            MeetingResultDisplay.GetComponent<Text>().text = "You gained five hearts.";
            _hearts += 5;
            PlayHeartRestoredSFX();
            FinishUpMeeting(_currMeetingBlock);
        }

    }

    private void FinishUpMeeting(MeetingBlock meetingBlockToResolve)
    {
        _meetingPool.Remove(meetingBlockToResolve);
        // Removing the current meeting block
        meetingBlockToResolve.gameObject.GetComponent<Image>().DOFade(0.0f, 0.5f).OnComplete(() => {
            // Move remaining meeting blocks towards top
            MoveMeetingBlocksUpwardsForOneBlock();
            GameObject.Destroy(meetingBlockToResolve.gameObject);
        });

        if (_meetingPool.Count <= 0)
        {
            string loseMessage = "You failed to impresss people enough to not to get laid off.";
            Lose(loseMessage);
        }
    }

    private void MoveMeetingBlocksUpwardsForOneBlock()
    {
        for (int i = 0; i < _meetingPool.Count; i++)
        {
            Vector2 savedAnchoredPosition = _meetingPool[i].GetComponent<RectTransform>().anchoredPosition;
            _meetingPool[i].GetComponent<RectTransform>().DOAnchorPosY(savedAnchoredPosition.y + MeetingBlockStride, 0.5f);
        }
    }

    private void ShowDialogOpening(MeetingBlock meetingBlock)
    {
        if (_npcDialogBox != null)
        {
            _npcDialogBox.GetComponentInChildren<Text>().text = meetingBlock.Dialog.Opening[LanguageSetting];
        }
    }

    private void DisplayMeetingElement(MeetingBlock meetingBlock)
    {
        
        ChooseResponsePrompt.SetActive(true);
        _meetingScreen = Instantiate(MeetingScreenPrefab, MeetingScreenContainer.transform);
        _meetingScreen.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 0);
        _meetingScreen.GetComponent<Image>().sprite = Resources.LoadAll<Sprite>(ResourceLibrary.NPCSpritePath)[ResourceLibrary.NPCSpriteIDs[meetingBlock.Guest.Type, meetingBlock.Guest.Importance]];
        _meetingScreen.GetComponent<Image>().DOFade(1.0f, 0.5f);
        _npcDialogBox = Instantiate(NPCDialogPrefab, MeetingScreenContainer.transform);
        _npcDialogBox.GetComponent<RectTransform>().anchoredPosition = new Vector2(4f, -217f);
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void RestartGame()
    {
        SceneManager.LoadScene("GamePlay");
    }

    #endregion

    #region Properties
    static public GameManager Instance;
    public int NumMeetings = 5;
    public GameObject MeetingBlockPrefab;
    public GameObject MeetingBlocksContainer;
    public GameObject MeetingScreenPrefab;
    public GameObject MeetingScreenContainer;
    public GameObject NPCDialogPrefab;
    public GameObject PlayerDialogBox;
    public GameObject ChooseResponsePrompt;
    public GameObject MeetingResultDisplay;
    public GameObject EndOfGamePanel;
    public Dialog[] DialogPool;
    public int[] PartyRelation { get => _partyRelation; }
    public int Hearts { get => _hearts; }
    public int RemainingMeetings { get => _meetingPool.Count; }
    public int LanguageSetting = 1;
    #endregion

    #region Field
    private int[] _partyRelation;
    private int _numTurns;
    private int _hearts;
    private List<MeetingBlock> _meetingPool;

    private MeetingBlock _currMeetingBlock;
    private GameObject _meetingScreen;
    private GameObject _npcDialogBox;
    private string _npcResponse;
    private string _resultText;
    private int _relationChange;
    private int _heartChange;

    private AudioSource _audioSrc;
    #endregion

    #region Constants
    public static readonly int MeetingBlockStride = 46;
    public static int relationIncreaseDelta = 5;
    public static int relationDecreaseDelta = 10;
    public static int numImportantNPCEachType = 7;
    public static int numRegularNPCEachType = 10;
    public static int numBreak = 9;
    #endregion
}
