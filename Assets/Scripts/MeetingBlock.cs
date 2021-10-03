using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MeetingBlock : MonoBehaviour
{
    public void SetMeetingContent(bool isBreak, NPC npc)
    {
        _isBreak = isBreak;
        _guest = npc;
        if (IsBreak)
        {
            _iconImage.sprite = Resources.LoadAll<Sprite>(ResourceLibrary.MeetingBlockSpritePath)[ResourceLibrary.BreakIconID];
        }
        else
        {
            var dialogPool = GameManager.GetInstance().DialogPool;
            _dialog = dialogPool[Random.Range(0, dialogPool.Length)];
            _iconImage.sprite = Resources.LoadAll<Sprite>(ResourceLibrary.MeetingBlockSpritePath)[ResourceLibrary.NPCIconIDs[_guest.Type, _guest.Importance]];
        }

    }

    // Start is called before the first frame update
    void Awake()
    {
        _iconImage = GetComponent<Image>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    #region Properties
    public bool IsBreak { get => _isBreak; }
    public NPC Guest { get => _guest; }
    public Dialog Dialog { get => _dialog; }
    #endregion

    #region Fields
    private bool _isBreak;
    private NPC _guest;
    private Dialog _dialog;
    private Image _iconImage;
    #endregion
}
