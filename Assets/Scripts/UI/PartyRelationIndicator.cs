using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PartyRelationIndicator : MonoBehaviour
{
    
    // Start is called before the first frame update
    void Start()
    {
        _gameManager = GameManager.GetInstance();
        _indicatorText = gameObject.GetComponentInChildren<Text>();
    }

    // Update is called once per frame
    void Update()
    {
        _indicatorText.text = _gameManager.PartyRelation[partyID].ToString();
        if (_gameManager.PartyRelation[partyID] < 20)
        {
            _indicatorText.color = Color.red;
        } else
        {
            _indicatorText.color = Color.black;
        }
    }

    private Text _indicatorText;
    private GameManager _gameManager;

    public int partyID;
}
